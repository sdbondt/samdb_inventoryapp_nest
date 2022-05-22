import { Message } from 'src/messages/message.entity'
import { Order } from 'src/orders/order.entity'
import { SectionsEnum } from 'src/types/types'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    password: string

    @Column({
        type: 'enum',
        enum: SectionsEnum
    })
    section: string

    @Column()
    username: string

    @Column({
        unique: true
    })
    email: string

    @OneToMany(
        () => Order,
        order => order.user
    )
    orders: Order[]

    @OneToMany(
        () => Message,
        message => message.receiver
    )
    messages: Message[]
    
}