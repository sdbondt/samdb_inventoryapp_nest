import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { ProductEnum} from "src/types/types";

export class CreateOrderDto {
    @IsEnum(ProductEnum)
    product: ProductEnum

    @IsNumber()
    @IsPositive()
    quantity: number

    @IsOptional()
    comment: string
}

export class DeliveredBoolean {
    @IsOptional()
    @IsBoolean()
    delivered: boolean
}