import nav from "./store/navigation";
import usr from "./store/user";
import vendor from "./store/vendors";
import config from "./store/config";
import entries from "./store/entries";
import notifications from "./store/notifications";

const store = {
    notifications: notifications,
    user: usr,
    navigation: nav,
    vendors: vendor,
    config: config,
    entries: entries,
};


export const user = usr;
export const navigation = nav;
export const vendors = vendor;
export const Config = config;
export const Entries = entries;
export const Notifications = notifications;
export default store;