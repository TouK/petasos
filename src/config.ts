import Env from "../_env";
import { StoreOptions } from "./store/store";

export const isDev = process.env.NODE_ENV === "development";

const domainName = window.location.href.match(new RegExp(Env.HERMES_DOMAIN_PATTERN));
const groupId = Env.HERMES_DOMAIN_MATCH_GROUP_ID;

export const HermesFrontendUrl =
    domainName && groupId ? `https://${domainName[groupId]}-${Env.HERMES_FRONTEND_ENDING}` : Env.HERMES_FRONTEND_DEFAULT;

export const Hosts = {
    APP_API: isDev
        ? `${new URL((document.currentScript as HTMLScriptElement)?.src).origin}/apps-proxy`
        : domainName && groupId
        ? `https://${domainName[groupId]}-${Env.HERMES_MANAGEMENT_ENDING}`
        : Env.HERMES_MANAGEMENT_DEFAULT,
};

const parseBool = (value: string): boolean => value === "true";

export const Options: StoreOptions = {
    forcedGroupName: Env.FORCED_GROUP_NAME,
    groupsHidden: parseBool(Env.GROUPS_HIDDEN),
    allowAdvancedFields: parseBool(Env.ALLOW_ADVANCED_FIELDS),
};
