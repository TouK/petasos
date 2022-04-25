import { getRandomizedName } from "./components/getRandomizedName";
import { isDev } from "./config";
import { Subscription } from "./store/subscription";
import { Topic } from "./store/topic";

const getDevGroupData = () => ({ name: getRandomizedName("group") });

const getDevTopicData = (topic?: Topic) =>
  topic
    ? {
        topic: getRandomizedName(
          `cloned__${topic.displayName.replace(".", "_")}`
        ),
      }
    : {
        topic: getRandomizedName("topic"),
        description: getRandomizedName("description"),
        schema: `{
          "type": "record",
          "name": "transaction",
          "namespace": "pl.touk",
          "fields": [
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "int"
            }
          ]
        }`,
      };

const getDevSubscriptionData = (subscription?: Subscription) =>
  subscription
    ? {
        name: getRandomizedName(
          `cloned__${subscription.name.replace(".", "_")}`
        ),
      }
    : {
        name: getRandomizedName("subscription"),
        endpoint: "http://localhost:21312",
        description: getRandomizedName("description"),
      };
const stub = () => ({});

export const getGroupData = isDev ? getDevGroupData : stub;
export const getTopicData = isDev ? getDevTopicData : stub;
export const getSubscriptionData = isDev ? getDevSubscriptionData : stub;
