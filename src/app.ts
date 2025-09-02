// 1. Создай enum для статуса заказа
enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    READY = 'ready',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

// 2. Создай enum для категорий блюд
enum DishCategory {
    APPETIZER = 'appetizer',
    MAIN = 'main',
    DESSERT = 'dessert',
    DRINK = 'drink'
}

// 3. Создай enum для ролей сотрудников
enum EmployeeRole {
    CHEF = 'chef',
    WAITER = 'waiter',
    MANAGER = 'manager',
    CASHIER = 'cashier'
}

// 4. Создай literal types для размеров порций
type PortionSize =  'small' | 'medium' | 'large'

// 5. Создай union type для способов оплаты
type PaymentMethod = 'cash' | 'card' | 'online'

interface ValidationResult {
    isValid: boolean
    error: string | null
}

// 6. Создай interface для блюда
interface Dish {
    id: number
    name: string
    category: DishCategory
    price: number
    size: PortionSize
    isAvailable: boolean
    ingredients: string[]
}

function isDish(data: unknown): data is Dish{
    if(typeof data === 'object' && data !== null && 'id' in data && 'name' in data && 'category' in data && 'price' in data && 'size' in data && 'isAvailable' in data && 'ingredients' in data){
        const dish = data as Dish
        return dish.id > 0 && dish.name.length > 0 && dish.category && dish.price > 0 && dish.size && dish.isAvailable && dish.ingredients.length > 0
    }
    return false
}

function validateDish(dish: Dish): ValidationResult{
    if(isDish(dish)){
        return {
            isValid: true,
            error: null
        }
    }
    return {
        isValid: false,
        error: 'Invalid dish'
    }
}

// 7. Создай interface для сотрудника
interface Employee {
    id: number
    name: string
    role: EmployeeRole
    salary: number
    isActive: boolean
}

function isEmployee(data: unknown): data is Employee{
    if(typeof data === 'object' && data !== null && 'id' in data && 'name' in data && 'role' in data && 'salary' in data && 'isActive' in data){
        const employee = data as Employee
        return employee.id > 0 && employee.name.length > 0 && employee.role && employee.salary > 0
    }
    return false
}

// 8. Создай type alias для заказа
type Order = {
    id: number
    dishes: Dish[]
    status: OrderStatus
    paymentMethod: PaymentMethod
    totalPrice: number
    orderDate: Date
    delivery: DeliveryResponse
}

function isOrder(data: unknown): data is Order{
    if(typeof data === 'object' && data !== null && 'id' in data && 'dishes' in data && 'status' in data && 'paymentMethod' in data && 'totalPrice' in data && 'orderDate' in data && 'delivery' in data){
        const order = data as Order
        return order.id > 0 &&  Array.isArray(order.dishes) && order.dishes.length > 0 && order.status && order.paymentMethod && order.totalPrice > 0 && order.orderDate instanceof Date 
    }
    return false
}

function validateOrder(order: Order): ValidationResult{
    if(isOrder(order)){
        return {
            isValid: true,
            error: null
        }
    }
    return {
        isValid: false,
        error: 'Invalid order'
    }
}


// 9. Создай interface для стола
interface Table {
    id: number
    capacity: number
    isOccupied: boolean
    currentOrder?: Order
}

interface DeliveryResponse {
    date: Date,
    address?: string,
    tableId?: number,
}

type RestaurantEvent = 
    | { type: 'order_created'; order: Order }
    | { type: 'order_status_changed'; orderId: number; newStatus: OrderStatus }
    | { type: 'dish_added'; dish: Dish }
    | { type: 'employee_hired'; employee: Employee }

abstract class Delivery {
    abstract getDeliveryInfo(): DeliveryResponse
    getData(): Date {
        return new Date()
    }
}

class HomeDelivery extends Delivery {
    address: string 
    constructor(address: string) {
        super()
        this.address = address
    }
    getDeliveryInfo(): DeliveryResponse {
        return {
            date: this.getData(),
            address: this.address
        }
    }
}

class RestorauntDelivery extends Delivery {
    tableId: number 
    constructor(tableId: number) {
        super()
        this.tableId = tableId
    }
    getDeliveryInfo(): DeliveryResponse {
        return {
            date: this.getData(),
            tableId: this.tableId
        }
    }
}


function handleEvent(event: RestaurantEvent): void {
    switch(event.type){
        case 'order_created':
            console.log('Order created:', event.order)
            break
        case 'order_status_changed':
            console.log('Order status changed:', event.orderId, event.newStatus)
            break
            case 'dish_added':
                console.log('Dish added:', event.dish)
                break
            case 'employee_hired':
                console.log('Employee hired:', event.employee)
                break
        default:
            console.log('Unknown event:', event)
            break
    }
}

class Restaurant {
    private dishes: Dish[] = []
    private employees: Employee[] = []
    private tables: Table[] = []
    private orders: Order[] = []

        addDish(dish: Dish): boolean {
            if(validateDish(dish).isValid){
                this.dishes.push(dish)
                handleEvent({ type: 'dish_added', dish })
                return true
            }
            return false

        }

         // Получить блюдо по ID
    getDishById(id: number): Dish | undefined {
        return this.dishes.find(dish => dish.id === id)
    }
    
    // Получить заказы по статусу
    getOrdersByStatus(status: OrderStatus): Order[] {
        return this.orders.filter(order => order.status === status)
    }
    
    getEmployeeById(id: number): Employee | undefined {
        return this.employees.find(employee => employee.id === id)
    }
    
    getTableById(id: number): Table | undefined {
        return this.tables.find(table => table.id === id)
    }
    
    // Обновить статус заказа
    updateOrderStatus(orderId: number, newStatus: OrderStatus): Order {
        const order = this.orders.find(o => o.id === orderId)
        if (!order) {
            throw new Error('Order not found')
        }
        order.status = newStatus
        handleEvent({ type: 'order_status_changed', orderId, newStatus })
        return order
    }
    
        deleteDish(dishId: number){
            this.dishes = this.dishes.filter(dish => dish.id !== dishId)
        }
        addEmployee(employee: Employee) {
            this.employees.push(employee)
            handleEvent({ type: 'employee_hired', employee })
        }
        deleteEmployee(employeeId: number){
            this.employees = this.employees.filter(employee => employee.id !== employeeId)
        }
        addTable(table: Table) {
            this.tables.push(table)
        }
        deleteTable(tableId: number){
            this.tables = this.tables.filter(table => table.id !== tableId)
        }
        createOrder( 
            dishes: Dish[],
            paymentMethod: PaymentMethod,
            delivery: DeliveryResponse): Order {
                const order: Order = {
                    id: this.orders.length + 1,
                    dishes,
                    status: OrderStatus.PENDING,
                    paymentMethod,
                    totalPrice: dishes.reduce((sum, dish) => sum + dish.price, 0),
                    orderDate: new Date(),
                    delivery
                }
                
            if(validateOrder(order).isValid){
                this.orders.push(order)
                handleEvent({ type: 'order_created', order })
                return order
            }
            throw new Error('Invalid order')
        }
        deleteOrder(orderId: number){
            this.orders = this.orders.filter(order => order.id !== orderId)
        }

        getStats() {
            return {
                totalDishes: this.dishes.length,
                totalEmployees: this.employees.length,
                totalTables: this.tables.length,
                totalOrders: this.orders.length,
                totalRevenue: this.orders.reduce((sum, order) => sum + order.totalPrice, 0)
            }
        }
    
}




// Создай тестовые данные
const dishes: Dish[] = [
    {
        id: 1,
        name: "Пицца Маргарита",
        category: DishCategory.MAIN,
        price: 800,
        size: 'large',
        isAvailable: true,
        ingredients: ['тесто', 'сыр', 'томаты']
    },
    {
        id: 2,
        name: "Салат Цезарь",
        category: DishCategory.APPETIZER,
        price: 400,
        size: 'medium',
        isAvailable: true,
        ingredients: ['салат', 'курица', 'сыр']
    }
]

const employees: Employee[] = [
    {
        id: 1,
        name: "Иван Петров",
        role: EmployeeRole.CHEF,
        salary: 50000,
        isActive: true
    },
    {
        id: 2,
        name: "Мария Сидорова",
        role: EmployeeRole.WAITER,
        salary: 30000,
        isActive: true
    }
]

const restaurant = new Restaurant()
// Добавь блюда
dishes.forEach(dish => restaurant.addDish(dish))
employees.forEach(employee => restaurant.addEmployee(employee))

const table: Table = {
    id: 1,
    capacity: 4,
    isOccupied: false
}

restaurant.addTable(table)

const delivery = new RestorauntDelivery(1)

const order = restaurant.createOrder(dishes, 'card', delivery.getDeliveryInfo())
restaurant.updateOrderStatus(order.id, OrderStatus.CONFIRMED)
restaurant.deleteDish(1)
restaurant.deleteEmployee(1)
restaurant.deleteTable(1)
restaurant.deleteOrder(order.id)

console.log(restaurant.getStats())




async function getPromise(){
    return new Promise<string>((resolve)=>{
        resolve('Hello')
    })
}


function StringifyInfo<T>(data: T): string | undefined {
    if(Array.isArray(data)){
        return data.toString()
    }
    switch(typeof data){
        case 'string':
            return data
        case 'number':
        case 'boolean':
        case 'function':
        case 'symbol':
        case 'bigint':
            return data.toString()
        case 'object':
            return JSON.stringify(data)
        default:
            return undefined
    }
    
}

type sorting = 'asc' | 'desc' 
function sortedById<T extends { id: number }, >(data: T[], by: sorting = 'asc' ):T[] {
    if(by === 'asc'){
        return data.sort((a, b) => a.id - b.id)
    }else if(by === 'desc'){
        return data.sort((a, b) => b.id - a.id)
    }
    return data.sort((a, b) => a.id - b.id)
}


const array1 = sortedById([{id: 1}, {id: 2}, {id: 3}], 'asc')
const array2 = sortedById([{id: 1}, {id: 2}, {id: 3}], 'desc')
const array3 = sortedById([{id: 1}, {id: 2}, {id: 3}])
console.log(array1)
console.log(array2)
console.log(array3)





class Stack<T>{
    private items: T[] = []
    
    push(item: T): T{
        this.items.push(item)
        return item
    }
    
    pop(): T | undefined{
        return this.items.pop()
    }
    
    peek(): T | undefined{
        return this.items[this.items.length - 1]
    }
    
    isEmpty(): boolean{
        return this.items.length === 0
    }
    
    size(): number{
        return this.items.length
    }
    
    // Дополнительный метод для просмотра всех элементов
    getItems(): T[] {
        return [...this.items] // Возвращаем копию массива
    }
}









type IGroup<T> = Record<string, T[]>;




let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

arr.slice(1,10) // [2, 3, 4, 5, 6, 7, 8, 9, 10]
// arr.splice(2,10) // [1]
arr.splice(6, 0, '0a', '0b')
console.log(arr)


interface Validator {
    isValid: boolean
    error?: string 
}

interface IForm {
    name: string, 
    password: string
}

type IFormResult<T> = {
    [Property in keyof T]: T[Property] extends boolean ? Validator : never
}






function getDate<T extends {new(...args: any[]): {}}>(constructor: T) {
    return class extends constructor {
        date = new Date()
    }
}

function Logs(rethrow: boolean = false) {
    return function(
        target: any, 
        propertyKey: string, 
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ): TypedPropertyDescriptor<(...args: any[]) => any> | void {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args: any[]) {
            try {
                return await originalMethod?.apply(this, args);
            } catch(error) {
                if(error instanceof Error) {
                    console.log('Error------------', error.message);
                    if(rethrow) {
                        throw error;
                    }
                }
            }
        };
        
        return descriptor;
    };
}


function Max(maxValue: number){
    return (target: any, propertyKey: string | symbol)=> {
        let value: number
        const setter = function(newValue: number){
            if(newValue > maxValue){
                throw new Error(`Value must be less than ${maxValue}`)
            }
            value = newValue
        }
        const getter = function(){
            return value
        }
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        })
    }
}

@getDate
class UserService {

    @Max(300)
    age: number

    name: string = 'test';
    constructor() {
        this.age = 400;  // ← Инициализация в конструкторе
    }
    // @Logs(true)
    getUser(): string {
        return this.name;
    }
    getAge(): number {
        return this.age;
    }
}

// Тестирование
const userService = new UserService();
console.log(userService.age); // 18

userService.age = 400; // Выведет ошибку и не изменит значение
console.log(userService.age); // Останется 18

userService.age = 200; // Работает нормально
console.log(userService.age); // 200



function MeasureTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`Time taken: ${end - start} milliseconds`);
        return result;
    };
}

class Calculator {
    @MeasureTime
    showCalculation() {
        for(let i = 0; i < 1000000; i++) {
            Math.random();
        }
        return 'done';
    }
}

// Тестирование
const calc = new Calculator();
const result = calc.showCalculation();
console.log('Result:', result);



function Cache1(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor{
    const originalMethod = descriptor.value;
    const cache = new Map<string, any>();
    descriptor.value = function(...args: any[]){
        const key = JSON.stringify(args)
        if(cache.has(key)){
            console.log(`[LOG] Кэш: ${key}`)
            return cache.get(key)
        }
        try{
            const result = originalMethod.apply(this, args)
            cache.set(key, result)
            return result
        }catch(error){
            console.log(`[LOG] Ошибка: ${(error as Error).message}`)
            throw error
        }
    }
    return descriptor
}


// Ваша задача: написать декоратор Log
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        const start = performance.now();
        console.log(`[LOG] Вызываем метод: ${propertyKey}`);
        console.log(`[LOG] Параметры: [${args.join(', ')}]`);
        
        try {
            const result = originalMethod.apply(this, args);
            console.log(`[LOG] Результат: ${result}`);
            return result;
        } catch(error) {
            console.log(`[LOG] Ошибка: ${(error as Error).message}`);
            throw error; // Перебрасываем ошибку дальше
        } finally {
            console.log(`[LOG] Время выполнения: ${performance.now() - start}ms`);
        }
    };
}

class UserService2 {
    // @Log
    // @Cache1
    getUser(id: number): string {
        // Имитация получения пользователя
        if (id < 0) {
            throw new Error('ID не может быть отрицательным');
        }
        return `Пользователь ${id}`;
    }

    // @Log
    createUser(name: string, age: number): object {
        // Имитация создания пользователя
        return { name, age, id: Math.random() };
    }
}

// // Тестирование
// const service = new UserService2();

// // Тест 1: Успешный вызов
// service.getUser(123);
// service.getUser(123);
// // Тест 2: Вызов с ошибкой
// service.getUser(-1);
// service.getUser(123);

// // Тест 3: Метод с несколькими параметрами
// service.createUser('John', 25);


// Singletom
class SingletonLogger {
    private static instance: SingletonLogger
    private logs: string[] = []

    private constructor(){}

    static getInstance(): SingletonLogger{
        if(!SingletonLogger.instance){
            SingletonLogger.instance = new SingletonLogger()
        }
        return SingletonLogger.instance
    }

    info(message: string){
        this.logs.push(`[LOG] ${message}`)
    }

    error(message: string){
        this.logs.push(`[ERROR] ${message}`)
    }

    warn(message: string){
        this.logs.push(`[WARN] ${message}`)
    }

    getLogs(): string[]{
        return this.logs
    }
    
    
}

const logger = SingletonLogger.getInstance()
logger.info('Info message')
logger.error('Error message')
logger.warn('Warn message')

console.log(logger.getLogs())


//TextFileProcessor
//ImageFileProcessor
//VideoFileProcessor


interface FileProcessor {
    process(file: string): void
    getSupportedFormats(): string[]
}

class TextFileProcessor implements FileProcessor {
    process(file: string): void {
        console.log(`Processing text file: ${file}`)
    }
    getSupportedFormats(): string[] {
        return ['txt', 'md', 'csv']
    }
}

class ImageFileProcessor implements FileProcessor {
    process(file: string): void {
        console.log(`Processing image file: ${file}`)
    }
    getSupportedFormats(): string[] {
        return ['jpg', 'png', 'gif']
    }
}

class VideoFileProcessor implements FileProcessor {
    process(file: string): void {
        console.log(`Processing video file: ${file}`)
    }
    getSupportedFormats(): string[] {
        return ['mp4', 'avi', 'mkv']
    }
}


abstract class FileProcessorFactory {
    abstract createProcessor(): FileProcessor;
    
    getSupportedFormats(): string[] {
        const fileProcessor = this.createProcessor();
        return fileProcessor.getSupportedFormats();
    }
    
    // Добавляем метод для обработки файла
    processFile(file: string): void {
        const processor = this.createProcessor();
        processor.process(file);
    }
}

class TextFileProcessorFactory extends FileProcessorFactory {
    createProcessor(): FileProcessor {
        return new TextFileProcessor()
    }
}

class ImageFileProcessorFactory extends FileProcessorFactory {
    createProcessor(): FileProcessor {
        return new ImageFileProcessor()
    }
}

class VideoFileProcessorFactory extends FileProcessorFactory {
    createProcessor(): FileProcessor {
        return new VideoFileProcessor()
    }
}

// Тестирование Factory
const textFactory = new TextFileProcessorFactory();
const imageFactory = new ImageFileProcessorFactory();
const videoFactory = new VideoFileProcessorFactory();

console.log('=== Тестирование File Processor Factory ===');

// Тест 1: Получение поддерживаемых форматов
console.log('Text formats:', textFactory.getSupportedFormats());
console.log('Image formats:', imageFactory.getSupportedFormats());
console.log('Video formats:', videoFactory.getSupportedFormats());

// Тест 2: Обработка файлов
textFactory.processFile('document.txt');
imageFactory.processFile('photo.jpg');
videoFactory.processFile('movie.mp4');

// Тест 3: Использование через общий интерфейс
function processFileByExtension(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    let factory: FileProcessorFactory;
    
    switch(extension) {
        case 'txt':
        case 'md':
        case 'csv':
            factory = new TextFileProcessorFactory();
            break;
        case 'jpg':
        case 'png':
        case 'gif':
            factory = new ImageFileProcessorFactory();
            break;
        case 'mp4':
        case 'avi':
        case 'mkv':
            factory = new VideoFileProcessorFactory();
            break;
        default:
            console.log(`Неподдерживаемый формат: ${extension}`);
            return;
    }
    
    factory.processFile(filename);
}

// Тестируем автоматический выбор процессора
processFileByExtension('report.txt');
processFileByExtension('photo.png');
processFileByExtension('video.mp4');
processFileByExtension('unknown.xyz');



class DataBase {
    connect(): void {
        console.log('Connected to the database')
    }
    disconnect(): void {
        console.log('Disconnected from the database')
    }
    query(sql: string): void {
        console.log(`Executing query: ${sql}`)
    }
}

class EmailService {
    sendEmail(to: string, subject: string, body: string): void {
        console.log(`Sending email to ${to} with subject ${subject} and body ${body}`)
    }
}


class UserServiceTest {
    private emailService: EmailService
    private database: DataBase

    constructor(emailService: EmailService, database: DataBase) {
        this.emailService = emailService
        this.database = database
    }

    registerUser(name: string, email: string): void {
        this.database.connect()
        this.database.query(`INSERT INTO users (name, email) VALUES ('${name}', '${email}')`)
        this.database.disconnect()
        this.emailService.sendEmail(email, 'Welcome to the system', 'Welcome to the system')
    }
    
    
}

const testUserService = new UserServiceTest(new EmailService(), new DataBase())
testUserService.registerUser('John Doe', 'john.doe@example.com')




class SendMoney {
    send(amount: number, userId: number, currency: string): {success: boolean, error?: string} {
        ////
        return {success: true}
    }
}


interface SendMoneyProcassor {
    sending(amount: number, id: number): boolean
}

class PaymentAdapter implements SendMoneyProcassor{
    private oldPayment: SendMoney

    constructor(oldPayment: SendMoney){
        this.oldPayment = oldPayment
    }

    sending(amount: number, id: number): boolean {
        const result = this.oldPayment.send(amount, id, 'USD')
        if(result.success){
            return true
        }
        return false
    }
}


const sendMoney = new SendMoney()
const paymentAdapter = new PaymentAdapter(sendMoney)

paymentAdapter.sending(100, 1)

//state

class DocumentItem {

    public text: string;
    public state: DocumentItemState

    constructor(text: string){
        this.text = text
        this.state = new DraftState()
        this.setState(new DraftState())
    }

    getState(){
        this.state.setContext(this)
        return this.state
    }
    setState(state: DocumentItemState){
        this.state = state
    }
    publish(){
        this.state.publish()
    }
}

abstract class DocumentItemState {
    public name: string
    protected item: DocumentItem

    constructor(){
        this.name = ''
        this.item = new DocumentItem('')
    }
    public setContext(item: DocumentItem){
        this.item = item
    }

    public abstract publish(): void
}

class DraftState extends DocumentItemState {
    constructor(){
        super()
        this.name = 'Draft'
    }
    publish(): void {
        this.item.setState(new ModerateState())
    }


}

class ModerateState extends DocumentItemState {
    constructor(){
        super()
        this.name = 'Draft'
    }
    publish(): void {
        this.item.setState(new PublishedState())
    }


}


class PublishedState extends DocumentItemState {
    constructor(){
        super()
        this.name = 'Draft'
    }
    publish(): void {
      console.log('Document published')
    }


}

const item = new DocumentItem('Hello')
item.getState().publish()
item.getState().publish()   
console.log(item.getState().publish())
console.log(item.getState().name)