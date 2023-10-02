import { task } from "mobx-task";
import { Task, TaskOptions as OriginalTaskOptions, WithoutPromise } from "mobx-task/lib/task";

export interface SomeFn<A extends any[], R extends Promise<any>> {
    (...args: A): R;
}

interface Executor<T> {
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
}

export function debouncePromise<A extends any[], R extends Promise<any>>(innerFn: SomeFn<A, R>, ms = 0, throttle = false) {
    let timeout = null;
    let executors: Executor<WithoutPromise<R>>[] = [];
    let fnPromise: R = null;

    function debounced(...args: A): R {
        return new Promise((resolve, reject) => {
            const boundFn = innerFn.bind(this);
            clearTimeout(timeout);
            executors.push({ resolve, reject });
            timeout = setTimeout(() => {
                boundFn(...args)
                    .then(
                        (value) => executors.forEach(({ resolve }) => resolve(value)),
                        (reason) => executors.forEach(({ reject }) => reject(reason)),
                    )
                    .then(() => (executors = []));
            }, ms);
        }) as R;
    }

    function throttled(...args: A): R {
        return new Promise((resolve, reject) => {
            const boundFn = innerFn.bind(this);
            if (!timeout || !fnPromise) {
                fnPromise = boundFn(...args);
                timeout = setTimeout(() => {
                    timeout = null;
                }, ms);
            }

            fnPromise.then(resolve, reject);
        }) as R;
    }

    return throttle ? throttled : debounced;
}

function renameTo({ name }: SomeFn<any, any>, prefix?: string) {
    return <F extends SomeFn<any, any>>(taskFn: F): F => {
        Object.defineProperty(taskFn, "name", {
            value: prefix ? `${prefix}:${name}` : name,
        });
        return taskFn;
    };
}

export interface TaskOptions<A extends any[], R> extends OriginalTaskOptions<A, R> {
    wait?: number;
    throttle?: boolean;
}

type OptionsKeys = keyof TaskOptions<any, any>;

interface DebouncedTaskCreator<K extends OptionsKeys> {
    <F extends SomeFn<any, any>, A extends Parameters<F>, R extends ReturnType<F>>(func: F, options?: Pick<TaskOptions<A, R>, K>): Task<
        A,
        R
    >;
}

interface DebouncedTaskFactory extends DebouncedTaskCreator<OptionsKeys> {
    resolved: DebouncedTaskCreator<Exclude<OptionsKeys, "state">>;
    rejected: DebouncedTaskCreator<Exclude<OptionsKeys, "state">>;
}

function debouncedTaskCreatorFactory<K extends OptionsKeys>(
    defaults?: Pick<TaskOptions<any, any>, K>,
): DebouncedTaskCreator<Exclude<OptionsKeys, K>> {
    return function (fn, options) {
        const {
            wait = 0,
            throttle = false,
            ...mergedOptions
        } = {
            ...defaults,
            ...options,
        };
        const debouncedFn = debouncePromise(fn, wait, throttle);
        return task(debouncedFn, mergedOptions).wrap(renameTo(fn, "debouncedTask"));
    };
}

const defaults: TaskOptions<never, never> = { wait: 500 };

export const debouncedTask = debouncedTaskCreatorFactory(defaults) as DebouncedTaskFactory;

debouncedTask.resolved = debouncedTaskCreatorFactory({
    ...defaults,
    state: "resolved",
});

debouncedTask.rejected = debouncedTaskCreatorFactory({
    ...defaults,
    state: "rejected",
});
