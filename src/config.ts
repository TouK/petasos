import Env from "../_env";
import { StoreOptions } from "./store/store";

const isDev = process.env.NODE_ENV === "development";

const domainName = window.location.href.match(
  new RegExp(Env.HERMES_DOMAIN_PATTERN)
);
const groupId = Env.HERMES_DOMAIN_MATCH_GROUP_ID;

export const HermesFrontendUrl =
  domainName && groupId
    ? `https://${domainName[groupId]}-${Env.HERMES_FRONTEND_ENDING}`
    : Env.HERMES_FRONTEND_DEFAULT;

export const Hosts = {
  APP_API: isDev
    ? "/apps-proxy"
    : domainName && groupId
    ? `https://${domainName[groupId]}-${Env.HERMES_MANAGEMENT_ENDING}`
    : Env.HERMES_MANAGEMENT_DEFAULT,
};

const parse = <T>(value: string): T => JSON.parse(JSON.stringify(value)) as T;

export const Options: StoreOptions = {
  forcedGroupName: Env.FORCED_GROUP_NAME,
  groupsHidden: parse(Env.GROUPS_HIDDEN),
  allowAdvancedFields: parse(Env.ALLOW_ADVANCED_FIELDS),
};
