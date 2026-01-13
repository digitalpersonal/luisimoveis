
import { InvoiceDetail, PaymentNotification, FinancialSettings, MercadoPagoSettings } from '../types';

/**
 * Recupera as configurações financeiras do sistema.
 */
export const getFinancialSettings = (): FinancialSettings => {
  const saved = localStorage.getItem('imobimaster_financial_settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    discountRate: 0.10,      // 10% desconto
    fineRate: 0.02,          // 2% multa
    monthlyInterestRate: 0.01 // 1% ao mês
  };
};

/**
 * Salva as configurações financeiras.
 */
export const saveFinancialSettings = (settings: FinancialSettings) => {
  localStorage.setItem('imobimaster_financial_settings', JSON.stringify(settings));
};

/**
 * Recupera credenciais do Mercado Pago.
 */
export const getMercadoPagoSettings = (): MercadoPagoSettings => {
  const saved = localStorage.getItem('luis_imoveis_mp_settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    publicKey: '',
    accessToken: '',
    isSandbox: true,
    webhookBaseUrl: 'https://[SEU-PROJETO].supabase.co/functions/v1/mercadopago-webhook'
  };
};

/**
 * Salva credenciais do Mercado Pago.
 */
export const saveMercadoPagoSettings = (settings: MercadoPagoSettings) => {
  localStorage.setItem('luis_imoveis_mp_settings', JSON.stringify(settings));
};

/**
 * Calcula os valores considerando desconto de pontualidade e mora configurados.
 */
export const calculateOverdueValues = (nominalValue: number, dueDateStr: string): InvoiceDetail => {
  const settings = getFinancialSettings();
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const discountValue = nominalValue * settings.discountRate;
  const isOverdue = today > dueDate;

  if (!isOverdue) {
    return {
      originalValue: nominalValue,
      discount: discountValue,
      dueDate: dueDateStr,
      fine: 0,
      interest: 0,
      totalValue: nominalValue - discountValue,
      daysOverdue: 0,
      isOverdue: false
    };
  }

  const diffTime = Math.abs(today.getTime() - dueDate.getTime());
  const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const interestPerDayPercent = settings.monthlyInterestRate / 30;
  const fineValue = nominalValue * settings.fineRate;
  const interestValue = nominalValue * (interestPerDayPercent * daysOverdue);
  const totalValue = nominalValue + fineValue + interestValue;

  return {
    originalValue: nominalValue,
    discount: 0, 
    dueDate: dueDateStr,
    fine: fineValue,
    interest: interestValue,
    totalValue,
    daysOverdue,
    isOverdue: true
  };
};

/**
 * Simula a criação de um pagamento Pix via API do Mercado Pago.
 */
export const createMercadoPagoPix = async (amount: number, description: string) => {
  // Em um ambiente real, aqui usaríamos o accessToken configurado
  const settings = getMercadoPagoSettings();
  console.log('Usando Public Key:', settings.publicKey);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'mp-' + Math.random().toString(36).substr(2, 9),
        status: 'pending',
        qr_code: '00020101021226840014br.gov.bcb.pix0162pix-mercadopago@luisimoveis.com5204000053039865405' + amount.toFixed(2) + '5802BR5920Luís Imóveis 6009SAO PAULO62070503***6304E32B',
        qr_code_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SimulatedPixPayment',
      });
    }, 1200);
  });
};

class PaymentEmitter extends EventTarget {
  notify(payment: PaymentNotification) {
    this.dispatchEvent(new CustomEvent('payment_confirmed', { detail: payment }));
  }
}

export const paymentEvents = new PaymentEmitter();

export const simulateWebhookConfirmation = (clientName: string, amount: number, propertyCode: string) => {
  const notification: PaymentNotification = {
    id: Math.random().toString(36).substr(2, 9),
    clientName,
    propertyCode,
    amount,
    timestamp: new Date().toLocaleTimeString(),
    type: 'PIX'
  };
  paymentEvents.notify(notification);
  const history = JSON.parse(localStorage.getItem('payment_history') || '[]');
  localStorage.setItem('payment_history', JSON.stringify([notification, ...history].slice(0, 10)));
};
