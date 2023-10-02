declare module "*.svg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.css" {
    const classes: { [key: string]: string };
    export default classes;
}

declare let _VERSION_: string;
