export interface ISRStore {
    getGroup(groupKey: string, localeCode: string): { [key: string]: any };
    hasModule(moduleName: string, localeCode: string): boolean;
    saveModule(moduleName: string, localeCode: string, datas: { [key: string]: { [key: string]: any } }): void;
    removeModule(moduleName: string, localeCode: string): void;
    clearLocale(localeCode: string): void;
    clearAll(): void;
}

export class MemoryStore implements ISRStore {

    public static Default: ISRStore = new MemoryStore();
    // public rootObject: any = {};
    constructor(public host: any = window || {}, public rootKey: string = 'i18n') {
        if (!this.host[rootKey]) {
            this.host[this.rootKey] = {}
        }
    }
    public get rootObject() {

        return this.host[this.rootKey];
    }
    removeModule(moduleName: string, localeCode: string): void {
        let localeNode = this.rootObject[localeCode];
        if (localeNode) {
            delete localeNode[moduleName];
        }
    }
    saveModule(moduleName: string, localeCode: string, datas: { [key: string]: { [key: string]: any; }; }): void {

        this.rootObject[localeCode] = this.rootObject[localeCode] || {}
        this.rootObject[localeCode][moduleName] = datas || {};
    }
    hasModule(moduleName: string, localeCode: string): boolean {
        let localeNode = this.rootObject[localeCode];
        if (!localeNode) return null;
        return moduleName in localeNode;
    }
    getGroup(groupKey: string, localeCode: string): { [key: string]: string } {
        let localeNode = this.rootObject[localeCode];
        if (!localeNode) return null;
        let [moduleName, groupName] = this.getModuleNameFromGroupKey(groupKey);
        let moduleNode = localeNode[moduleName];
        if (!moduleNode) return null;
        return moduleNode[groupName];
    }

    clearLocale(localeCode: string): void {
        delete this.rootObject[localeCode];
    }

    clearAll(): void {
        this.host[this.rootKey] = {};
    }

    private getModuleNameFromGroupKey(groupKey: string): string[] {
        return (groupKey || '.').split('.');
    }
}
