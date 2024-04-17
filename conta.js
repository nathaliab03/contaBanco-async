const contasBanco = [
    {
        nome: 'Maria',
        saldo: 1000
    },
    {
        nome: 'João',
        saldo: 0
    }
];

async function consultarBanco(contaConsultada){
    // Retorna da promise, o valor aceito (resolve) ou não (rejected)
    return new Promise((resolve, reject) => {
        // Define o tempo de resposta
        setTimeout(()=> {
            // Verifica se a contaConsultada existe dentro do array de contasBanco
            let conta = contasBanco.find(contaProcurada => contaProcurada.nome === contaConsultada);

            //Se a conta não existir, ela vai lançar o erro e retornar o valor
            if(!conta){
                reject(new Error(`Conta '${contaConsultada}' não existe`));
                return;
            }

            //Se a conta existir, retorna a conta consultada
            resolve(conta);
        }, 1000);
    });
}

/*
    Promises: 
    nas funções a seguir, o await irá esperar até que função consultarBanco, que está com delay de 1s devido ao setTimeOut, se resolva (ou seja, irá vericar se a conta existe ou não) antes de prosseguir com o depósito 
    obs: o await só funciona em async functions

    Try/Catch:
    O try irá tentar efetuar a operação (deposito, saque, transferencia), se a conta não existir, irá pegar o erro que foi lançado na função consultarBanco(), irá lançar no console como erro, e prosseguirá com o código.
    Se não utilizar o try/catch, o console irá mostrar o erro, mas o programa irá quebrar.
    Fiz uma função especifica para testar, mas é possível efetuar direto em cada função
*/


// Testa se a conta existe no consultarBanco()
async function verificaExistenciaConta(contaOrigem){
    try{
        const conta = await consultarBanco(contaOrigem);
        return conta;
    } catch(error) {
        console.error(`Erro ao depositar: ${error.message}`)
        return null;
    }
}

async function depositar(valorDepositado, contaOrigem){
    // Chama a função que verifica se a contaOrigem existe no banco
    const conta = await verificaExistenciaConta(contaOrigem);

    // Se a conta não existir irá retornar o erro
    if(!conta)
        return;
    
    // Se a conta existir prossegue com o depósito
    if(valorDepositado > 0){
        // Valor do saldo é atualizado
        conta.saldo += valorDepositado
        // to.Fixed(2) fixa o valor em 2 casas decimais
        console.log(`Depósito de R$ ${valorDepositado.toFixed(2)} efetuado com sucesso.`);
    } else
        console.log("O valor do depósito precisa ser maior do que 0");    
}

async function sacar(valorSacado, contaOrigem){
    const conta = await verificaExistenciaConta(contaOrigem);
    if(!conta)
    return;

    if(valorSacado <= conta.saldo){
        conta.saldo -= valorSacado;
        console.log(`Saque de R$ ${valorSacado.toFixed()} efetuado com sucesso. | Novo saldo: R$ ${conta.saldo.toFixed(2)}`);
    } else
        console.log(`Saldo Insuficiente. Saldo Atual: R$ ${conta.saldo.toFixed(2)}`);
    return valorSacado;
}

async function transferir(valorTransferido, contaOrigem, contaDestino){
    const destinoTransf = await verificaExistenciaConta(contaDestino);
    if(!destinoTransf)
    return;

    // Realiza o saque da conta origem
    const valorSacado = await sacar(valorTransferido, contaOrigem);
    // Se o saque for bem sucedido (valorSacado não nulo), deposita o valor na conta destino
    if (valorSacado != null) {
        destinoTransf.saldo += valorSacado;
        console.log(
        `Transferência de R$ ${valorTransferido.toFixed(2)} realizada com sucesso da conta de ${contaOrigem} para a conta ${contaDestino}. Novo saldo de João: ${destinoTransf.saldo.toFixed(2)}`);
    }
}

depositar(10, 'Maria');
sacar(10000, 'Maria');
transferir(100, 'Maria', 'rere');
transferir(100, 'Maria', 'João');
