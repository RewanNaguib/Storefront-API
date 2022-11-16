import {UserType, User} from "../user";
import {ProductType, Product} from "../product";
import {OrderType, OrderProductType, Order} from "../order";
import client from "../../database";
import supertest from 'supertest';



const user = new User();
const product = new Product();
const order = new Order();

describe('User Model',()=>{
    it('should have create method', ()=>{
        expect(user.create).toBeDefined();
    });
});