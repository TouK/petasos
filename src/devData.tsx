import { getRandomizedName } from "./components/getRandomizedName";
import { isDev } from "./config";

const getDevGroupData = () => ({ name: getRandomizedName("group") });

const stub = () => ({});

export const getGroupData = isDev ? getDevGroupData : stub;
