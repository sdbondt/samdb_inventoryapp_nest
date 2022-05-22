import { Order } from "src/orders/order.entity"
import { User } from "src/users/user.entity"
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('message')
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @ManyToOne(
        () => User,
        user => user.messages
    )
    @JoinColumn({
        name: 'userId'
    })
    receiver: User

    @Column({
        name: 'userId'
    })
    receiverId: number

    @ManyToOne(
        () => Order,
        order => order.messages
    )
    @JoinColumn({
        name: 'orderId'
    })
    order: Order

    @Column({
        name: 'orderId'
    })
    orderId: number
}