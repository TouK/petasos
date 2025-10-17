import { getRandomizedName } from "./components/getRandomizedName";
import { isDev } from "./config";
import { Subscription } from "./store/subscription";

const getDevGroupData = () => ({ name: getRandomizedName("group") });

const getDevSubscriptionData = (subscription?: Subscription) =>
    subscription
        ? {
              name: getRandomizedName(`cloned__${subscription.name.replace(".", "_")}`),
          }
        : {
              name: getRandomizedName("subscription"),
              endpoint: "http://localhost:21312",
              description: getRandomizedName("description"),
          };
const stub = () => ({});

export const getGroupData = isDev ? getDevGroupData : stub;

export const getSubscriptionData = isDev ? getDevSubscriptionData : stub;
