interface LoanRequest {
    amount: number
    customerName: string
    purpose: string
}

abstract class LoanHandler {
    protected nextHandler?: LoanHandler 

    setNext(handler: LoanHandler ): LoanHandler {
      this.nextHandler = handler
      return handler
    }

    abstract process(request: LoanRequest): void
}


class JuniorHandler extends LoanHandler {
    process(request: LoanRequest): void {
        if(request.amount < 1000) {
            console.log('одобрено')
            return
        }
        if(this.nextHandler){
            this.nextHandler.process(request)
        }else {
            console.log('не одобрено')
        }
    }

}


class MiddleHandler extends LoanHandler {
    process(request: LoanRequest): void {
        if(request.amount < 5000 && request.amount >= 1000) {
            console.log('одобрено')
            return
        }
        if(this.nextHandler){
            this.nextHandler.process(request)
        }else {
            console.log('не одобрено')
        }
    }

}

class SeniorHandler extends LoanHandler {
    process(request: LoanRequest): void {
        if(request.amount < 10000 && request.amount >= 5000 ) {
            console.log('одобрено')
            return
        }
        if(this.nextHandler){
            this.nextHandler.process(request)
        }else {
            console.log('не одобрено')
        }
    }

}

class DirectorHandler extends LoanHandler {
    process(request: LoanRequest): void {
        if(request.amount >=  10000 ) {
            console.log('одобрено')
            return
        }
        if(this.nextHandler){
            this.nextHandler.process(request)
        }else {
            console.log('Заявка откланена')
        }
    }

}

const req1: LoanRequest = { amount: 500, customerName: "Иван", purpose: "Покупка телефона" };
const req2: LoanRequest = { amount: 2500, customerName: "Мария", purpose: "Ремонт квартиры" };
const req3: LoanRequest = { amount: 7500, customerName: "Петр", purpose: "Покупка автомобиля" };
const req4: LoanRequest = { amount: 15000, customerName: "Анна", purpose: "Открытие бизнеса" };
const req5: LoanRequest = { amount: 50000, customerName: "Сергей", purpose: "Инвестиции" };

// 1. Создаем обработчики
const junior = new JuniorHandler();
const middle = new MiddleHandler();
const senior = new SeniorHandler();
const director = new DirectorHandler();


junior.setNext(middle).setNext(senior).setNext(director);

console.log("=== Тестирование цепочки ===");
junior.process(req1);  // Должен одобрить Junior
junior.process(req2);  // Должен одобрить Middle  
junior.process(req3);  // Должен одобрить Senior
junior.process(req4);  // Должен одобрить Director
junior.process(req5);  // Должен одобрить Director