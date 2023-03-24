import { ModuleKind } from "typescript"

export const role2str = (rolenum: number) => {
    if (rolenum == 1) {
        return 'PRODUCTMANAGER'
    }
    if (rolenum == 2) {
        return 'PROJECTMANAGER'
    }
    if (rolenum == 3) {
        return 'DEVELOPER'
    }
    if (rolenum == 4) {
        return 'DESIGNER'
    }
    if (rolenum == 5) {
        return 'MARKETER'
    }
    if (rolenum == 6) {
        return 'QAENGINEER'
    }
    return 'NONE'
}