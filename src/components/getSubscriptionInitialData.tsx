import { AdvancedSubscriptionFormikValues } from "../models";
import { Subscription } from "../store/subscription";
import { getRandomizedName } from "./getRandomizedName";

const DEFAULT_SUBSCRIPTION_VALUES = {
    name: "subscription",
    endpoint: "https://",
    description: "",
    advancedValues: new AdvancedSubscriptionFormikValues(),
};

export const getSubscriptionInitialData = (subscription?: Subscription) => {
    if (!subscription) {
        return {
            ...DEFAULT_SUBSCRIPTION_VALUES,
            name: getRandomizedName(`${DEFAULT_SUBSCRIPTION_VALUES.name}_`),
        };
    }

    return {
        ...subscription.toForm,
        name: getRandomizedName(`${subscription.name.replace(".", "_")}_`),
    };
};
