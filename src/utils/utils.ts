import _ from 'lodash';

type AcceptableGetClassesType = string | boolean | undefined | null | 0;


export function getClasses(...args: Array<AcceptableGetClassesType | AcceptableGetClassesType[]>): string {
    return _.flatten(args).filter(Boolean).join(' ');
}
