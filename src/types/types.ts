export enum SectionsEnum {
    PRODUCTION = 'production',
    DESIGN = 'design',
    MANUFACTURING = 'manufacturing',
    SUPPLY = 'supply',
    SALES = 'sales'
}

export enum ProductEnum {
    PAPER = 'paper',
    OIL = 'oil',
    COMPONENTS = 'components',
    STEEL = 'steel',
    COAL = 'coal'
}

export interface SearchOrdersInterface {
    userId?: number;
    delivered?: boolean,
    orderBy?: string
}