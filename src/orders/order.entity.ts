import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ProductEnum, SectionsEnum } from 'src/types/types'
import { User } from 'src/users/user.entity'
import { Message } from 'src/messages/message.entity'

@Entity('order')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: SectionsEnum
    })
    section: string

    @Column({
        type: 'enum',
        enum: ProductEnum
    })
    product: string

    @Column()
    quantity: number

    @Column({
        default: false
    })
    delivered: boolean

    @ManyToOne(
        () => User,
        user => user.orders
    )
    @JoinColumn({
        name: 'userId'
    })
    user: User

    @Column({
        name: 'userId'
    })
    userId: number

    @CreateDateColumn()
    orderedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({
        default: 'No extra comments'
    })
    comment: string

    @OneToMany(
        () => Message,
        message => message.order
    )
    messages: Message[]
    
}