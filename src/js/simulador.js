/**
 * Clase Client (Cliente)
 */
 class Client {
    // Patrón de expresión regular para validar correos electrónicos.
    static #VALID_EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    /**
     * Crea una instancia de Cliente con nombre(s) de pila, apellido(s) y dirección
     * de correo electrónico.
     * 
     * @param {string} firstName El/los nombre(s) de pila del Cliente.
     * @param {string} lastName El/los apellido(s) del Coiente.
     * @param {string} emailAddress La dirección de correo electrónico del Cliente.
     */
    constructor(firstName, lastName, emailAddress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
    }

    /**
     * Establece el/los snmbre(s) de pila del Cliente.
     * 
     * @param {string} value
     */
    set firstName(value) {
        if(value !== null && value.length > 3) {
            this.fname = value;
            return true;
        }

        return false;
    }

    /**
     * Devuelve el/los nombre(s) de pila del Cliente.
     */
    get firstName() {
        return this.fname;
    }

    /**
     * Establece el/los apellido(s) del Cliente.
     * 
     * @param {string} value
     */
    set lastName(value) {
        if(value !== null && value.length > 0) {
            this.lname = value;
            return true;
        }

        return false;
    }

    /**
     * Devuelve el/los apellido(s) del Cliente.
     */
    get lastName() {
        return this.lname;
    }

    /**
     * Establece el correo electrónico del Cliente
     * 
     * @param {string} value
     */
    set emailAddress(value) {
        if(Client.isValidEmail(value)) {
            this.email = value;
            return true;
        }

        return false;
    }

    /**
     * Devuelve la dirección de correo electrónico del Cliente.
     */
    get emailAddress() {
        return this.email;
    }

    /**
     * Valida si una cadena de caracteres cumple con los requisitos de
     * una dirección de correo electrónico utilizando expresiones 
     * regulares (regex).
     * 
     * @param {string} address 
     */
    static isValidEmail(address) {
        if (address.match(Client.#VALID_EMAIL_PATTERN)) {
            return true;
        }

        return false;
    }
}


/**
 * Clase Budget (Presupuesto)
 */
 class Budget {
    // Tasa de IVA: 16.00%
    static #VAT_RATE = 0.16;

    // Meses por año (para calcular la tasa de interés parcial).
    static #MONTHS_PER_YEAR = 12;

    /**
     * Crea una instancia de presupuesto (Budget) con importe (credit), número de
     * períodos / meses (periods) y tasa de interés (interest) definidos.
     * 
     * @param {number} credit El importe del crédito.
     * @param {number} periods La cantidad de meses en que deberá ser pagado el importe del crédito.
     * @param {number} interest La tasa de interés anual que cobra el banco por el crédito otorgado.
     */
    constructor(credit, periods, interest) {
        this.amount = credit;
        this.numberOfPeriods = periods;
        this.interestRate = interest;
    }

    /**
     * Establece el importe del crédito.
     * 
     * @param {number} value Un número mayor o igual a 0 (cero).
     */
    set amount(value) {
        let credit = parseFloat(value);

        if (!isNaN(credit) && isFinite(credit) && credit !== null && credit >= 0) {
            this.credit = credit;
            return true;
        }

        return false;
    }

    /**
     * Devuelve el importe del crédito.
     */
    get amount() {
        return this.credit;
    }

    /**
     * Establece la cantidad de períodos (meses) en que se pagará el crédito.
     * 
     * @param {number} value Un entero positivo representando la cantidad de meses.
     */
    set numberOfPeriods(value) {
        let periods = parseInt(value);

        if (!isNaN(periods) && isFinite(periods) && periods !== null && periods > 0) {
            this.periods = periods;
            return true;
        }

        return false;
    }

    /**
     * Devuelve la cantidad de períodos (meses) en que se pagará el crédito.
     */
    get numberOfPeriods() {
        return this.periods;
    }

    /**
     * Establece la tasa de interes anual que cobra el banco por el crédito otorgado.
     * 
     * @param {number} value Un número positivo representando la tasa de interés.
     */
    set interestRate(value) {
        let interest = parseFloat(value);

        if (!isNaN(interest) && isFinite(interest) && interest !== null && interest > 0) {
            this.interest = interest;
            return true;
        }

        return false;
    }

    /**
     * Devuelve la tasa de interés anual que cobra el banco por el crédito otorgado.
     */
    get interestRate() {
        return this.interest;
    }

    /**
     * Construye una tabla de amortización para un cliente específico, con las propiedades
     * del objeto Budget (Presupuesto): Importe del crédito (amount), número de períodos o
     * meses en los que se pagará el importe del crédito (numberOfPeriods) y tasa de 
     * interés del crédito (interestRate).
     * 
     * @param {Client} client Instancia de Cliente para el que se hace la tabla.
     * @returns Un objeto JSON con los datos del cliente y los detalles de la tabla de amortización.
     */
    getAmortizationTable(client) {
        // Primero se verifica que se tengan todos los parámetros necesarios para el cálculo de la tabla.
        if (this.amount && this.interestRate && this.numberOfPeriods) {
            // Primero, se crea un objeto JSON donde se guardarán los datos del cliente, así como 
            // de la tabla de amortización (pagos) del crédito. Inicialmente sólo contiene los datos 
            // del cliente, y posteriormente se agregarán las filas para cada período de pago.
            let tabla = {
                cliente: {
                    'nombres': client.firstName,
                    'apellidos': client.lastName,
                    'email': client.email,
                },
                credito: {
                    'importe': this.amount,
                    'tasaDeInteres': this.interestRate,
                    'meses': this.numberOfPeriods,
                    'pagos': [],
                    'totales': {
                        'totalCapital': 0,
                        'totalIntereses': 0,
                        'totalIvaIntereses': 0,
                        'totalPagos': 0,
                    }
                }
            };

            // La tasa de interés parcial es la tasa de interés que se aplica a cada período (mes)
            // del crédito. Se calcula dividiendo la tasa de interés anual entre 12 (12 meses del año)
            let partialInterestRate = this.interestRate / Budget.#MONTHS_PER_YEAR;

            // El importe del pago parcial (mensual) de un crédito con interés compuesto, incluyendo intereses, es:
            // P = C * ([i * (i + 1)^n] / [{(i + 1)^n} - 1])
            // Donde:
            // P:   Importe del pago parcial (mensual) del crédito, incluyendo amortización e intereses.
            // C:   Importe del crédito total.
            // i:   Tasa de interés parcial (mensual).
            // n:   Número de parcialidades (meses) en que será pagado el crédito.
            let upperTerm = partialInterestRate * Math.pow(partialInterestRate + 1, this.numberOfPeriods);
            let lowerTerm = Math.pow(partialInterestRate + 1, this.numberOfPeriods) - 1
            let payment = this.amount * upperTerm / lowerTerm;

            // Ahora hay que calcular los valores de la tabla de amortización para cada período (mes) de pago,
            // empezando desde el mes 1, hasta el mes n = numerOfPeriods.
            // Para cada perído se calcularán las variables Saldo Inicial (initalAmount), Amortización (amortization),
            // Interés (interestAmount), IVA de los intereses (interestVAT), Pago Total (totalPayment) y Saldo
            // Final (finalAmount), que serán declarados e inicializados antes de entrar al bucle.
            let initialAmount = 0.00;
            let interestAmount = 0.00;
            let amortization = 0.00;
            let interestVAT = 0.00;
            let totalPayment = 0.00;
            let finalAmount = 0.00;
            let paymentRow = {};

            // También declaro las variables que guardan los totales para el resumen al final de la tabla.
            let totalPrincipalPayments = 0;
            let totalInterestsPayments = 0;
            let totalInterestsVatPayments = 0;
            let totalPayments = 0;

            // Como es conocido el número de períodos que serán calculados, se hace 
            // dentro de un bucle for, desde el período 1 hasta el período n = numberOfPeriods.
            for (let period = 1; period <= this.numberOfPeriods; period++) {
                // Para el primer período ...
                if (period === 1 ) {
                    // El saldo inicial es igual al monto total del crédito.
                    initialAmount = this.amount;
                } else {
                    // En casos subsecuentes, el saldo inicial es igual al saldo final del ciclo anterior.
                    initialAmount = finalAmount;
                }

                // El importe de intereses del período es igual al saldo inicial multiplicado por la tasa de interés parcial.
                interestAmount = parseFloat((initialAmount * partialInterestRate).toFixed(2));

                // Actualizo el total de pagos de intereses.
                totalInterestsPayments += interestAmount;

                // Si estamos el en último período ...
                if (period === this.numberOfPeriods) {
                    // ... entonces la amortización es igual al saldo inicial ...
                    amortization = initialAmount;
                } else {
                    // ... de lo contrario, la amortización pagada es la diferencia entre el pago fijo 
                    // mensual (payment) y el interés del período.
                    amortization = parseFloat((payment - interestAmount).toFixed(2));
                }

                // Actualizo el total de pagos a capital.
                totalPrincipalPayments += amortization;

                // El IVA de los intereses del período es el producto de la tasa de IVA y el interés del período.
                interestVAT = parseFloat((interestAmount * Budget.#VAT_RATE).toFixed(2));

                // Actualizo el total de pagos de IVA de intereses.
                totalInterestsVatPayments += interestVAT;

                // El pago total del período es la suma de la amortización, los intereses y el IVA de los intereses.
                totalPayment = amortization + interestAmount + interestVAT;

                // Actualizo el total de pagos.
                totalPayments += totalPayment;

                // El saldo al final del período es la diferencia entre el saldo inicial y la amortización.
                finalAmount = parseFloat((initialAmount - amortization).toFixed(2));

                // Se crea la fila de pago del período.
                paymentRow = {
                    'periodo': period,
                    'saldoInicial': initialAmount,
                    'amortizacion': amortization,
                    'interes': interestAmount,
                    'ivaInteres': interestVAT,
                    'pagoTotal': totalPayment,
                    'saldoFinal': finalAmount
                };

                // Se agrega la fila de pago del período al arreglo de pagos de la tabla.
                tabla.credito.pagos.push(paymentRow);
            }

            // Coloco los valores de los totales en la tabla.
            tabla.credito.totales.totalCapital = totalPrincipalPayments;
            tabla.credito.totales.totalIntereses = totalInterestsPayments;
            tabla.credito.totales.totalIvaIntereses = totalInterestsVatPayments;
            tabla.credito.totales.totalPagos = totalPayments;

            // Se devuelve la tabla y sale de la función.
            return tabla;
        }

        // Si llega aquí es porque no se contaba con todos los datos para calcular la Tabla de Amortización.
        return {'error': 'No hay suficientes datos para calcular la Tabla de Amortización.'};
    }
}

// Formulario
const budgetForm = document.getElementById('rfp-form');

// Campo para el/los nombre(s) de pila del Cliente
const clientFirstNameField = document.getElementById('client-fname');

// Etiqueta para mostrar errores de validación del campo client-fname.
const clientFirstNameFieldError = document.getElementById('client-fname-error');

// Campo para el/los apellido(s) del Cliente.
const clientLastNameField = document.getElementById('client-lname');

// Campo para el correo electrónico del Cliente.
const clientEmailField = document.getElementById('client-email');

// Opciones para el tipo de Crédito.
const creditTypesField = document.getElementsByName('credit-type');

// Campo para el importe del Crédito.
const creditAmountField = document.getElementById('credit-amount');

// Selecctionador del plazo del Crédito.
const creditTimeField = document.getElementById('credit-time');

// Nodo de salida de la tabla de amortización.
const outputNode = document.getElementById('output-node');

// Captura el evento envío del formulario.
budgetForm.addEventListener('submit', event => {
    let clientFirstName = clientFirstNameField.value;

    let clientLastName = clientLastNameField.value;

    let clientEmail = clientEmailField.value;

    let creditAmount = parseFloat(creditAmountField.value);

    let creditInterestRate = getInterestRate(Array.from(creditTypesField).find(element => element.checked).id);

    let creditPaybackTime = parseFloat(creditTimeField.value);

    let client = new Client(clientFirstName, clientLastName, clientEmail);

    let budget = new Budget(creditAmount, creditPaybackTime, creditInterestRate);

    let amortizationTable = budget.getAmortizationTable(client);

    clearOutput();

    displayTable(amortizationTable);

    event.preventDefault();
});

// Cuando el usuario presiona el botón 'Limpiar'
budgetForm.addEventListener('reset', event => {
    clearOutput();
});

// Valida los campos de Nombre(s) y Apellido(s) del Cliente (client-fname)
const isValidName = value => {
    // Nombre(s) y Apellido(s) no deben ser nulos y tener, por lo menos, 1 caracter
    return value !== null && value.length > 0
};

// Devuelve la tasa de interés según el tipo de crédito elegido.
// Se coloca en una función con un switch para fomentar la reutilización:
// Si se agregan nuevos tipos de créditos, con diferentes tasas, únicamente se
// agregan más cases al switch.
const getInterestRate = type => {
    switch (type) {
        // Crédto hipotecario: interés del 11.00% anual
        case 'mortgage':
            return 0.11;
        
        // Crédito automotriz: interés del 14.00% anual
        case 'car-buying':
            return 0.14;
        
        // Crédito para el consumo: interés del 25.00% anual
        case 'consumption':
            return 0.25;
        
        // Otros créditos: interés del 35.00% anual
        case 'other':
        default:
            return 0.35;
    }
};

// Limpia el nodo de salida.
const clearOutput = () => {
    outputNode.innerHTML = "";
};

// Escribe la Tabla de Aortización en el nodo de salida.
const displayTable = table => {
    // console.debug(table);

    // Colocar el nombre del cliente como título (h3) de la sección.
    let outputClientName = document.createElement('h3');
    outputClientName.innerHTML = `${table.cliente.nombres} ${table.cliente.apellidos}`;
    outputNode.appendChild(outputClientName);

    // Y el correo electrónico como subtítulo (h4).
    let outputClientEmail = document.createElement('h4');
    outputClientEmail.innerHTML = `${table.cliente.email}`;
    outputNode.appendChild(outputClientEmail);

    // Crear un tag <table></table> para la tabla de pagos.
    let paymentsTable = document.createElement('table');
    paymentsTable.classList.add('payments-table');

    // Encabezado de la tabla.
    let paymentsTableHeader = document.createElement('thead');
    // Títulos de las columnas.
    let paymentsTableHeaderRow = document.createElement('tr');
    paymentsTableHeaderRow.classList.add('header-row');
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'Período';
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'Saldo inicial';
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'Amortización';
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'Intereses';
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'IVA de intereses';
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'Pago total';
    paymentsTableHeaderRow.appendChild(document.createElement('th')).innerHTML = 'Saldo final';
    paymentsTableHeader.appendChild(paymentsTableHeaderRow);
    paymentsTable.appendChild(paymentsTableHeader);

    // Cuerpo de la tabla.
    let paymentsTableBody = document.createElement('tbody');

    // Variables donde se guardan los valores de cada celda por fila.
    let rowPeriodo = 0;
    let rowSaldoInicial = 0;
    let rowAmortizacion = 0;
    let rowIntereses = 0;
    let rowIvaIntereses = 0;
    let rowPagoTotal = 0;
    let rowSaldoFinal = 0;
    let paymentsTableBodyRow = null;

    // Bucle para recorrer todos los períodos en la tabla de amortización y
    // crear una fila en la tabla para cada uno.
    table.credito.pagos.forEach(row => {
        paymentsTableBodyRow = document.createElement('tr');
        paymentsTableBodyRow.classList.add('body-row');
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = row.periodo;
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(row.saldoInicial);
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(row.amortizacion);
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(row.interes);
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(row.ivaInteres);
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(row.pagoTotal);
        paymentsTableBodyRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(row.saldoFinal);
        paymentsTableBody.appendChild(paymentsTableBodyRow);
    });

    // Poner el Body en la Tabla ...
    paymentsTable.appendChild(paymentsTableBody);

    // El pie de la tabla con el resumen (totales) de los pagos.
    let tableFooter = document.createElement('tfoot');
    let tableFooterRow = document.createElement('tr');
    tableFooterRow.classList.add('footer-row');
    tableFooterRow.appendChild(document.createElement('td')).innerHTML = 'TOTALES';
    tableFooterRow.appendChild(document.createElement('td'));   // Celda vacía.
    tableFooterRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(table.credito.totales.totalCapital);
    tableFooterRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(table.credito.totales.totalIntereses);
    tableFooterRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(table.credito.totales.totalIvaIntereses);
    tableFooterRow.appendChild(document.createElement('td')).innerHTML = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(table.credito.totales.totalPagos);
    tableFooterRow.appendChild(document.createElement('td'));   // Celda vacía.
    tableFooter.appendChild(tableFooterRow);
    paymentsTable.appendChild(tableFooter);

    // Poner la tabla en el nodo de salida...
    outputNode.appendChild(paymentsTable);
};
