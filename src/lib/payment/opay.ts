import axios from 'axios'

const OPAY_MERCHANT_ID = process.env.OPAY_MERCHANT_ID
const OPAY_SECRET_KEY = process.env.OPAY_SECRET_KEY
const OPAY_PUBLIC_KEY = process.env.OPAY_PUBLIC_KEY
const OPAY_BASE_URL = 'https://api.opayweb.com'

interface InitializePaymentParams {
  reference: string
  amount: number // in Naira
  currency: string
  country: string
  customerEmail: string
  customerName: string
  customerPhone: string
  callbackUrl: string
  returnUrl: string
}

interface InitializePaymentResponse {
  code: string
  message: string
  data: {
    cashierUrl: string
    orderNo: string
    reference: string
  }
}

interface VerifyPaymentParams {
  reference: string
  orderNo: string
}

interface VerifyPaymentResponse {
  code: string
  message: string
  data: {
    orderNo: string
    reference: string
    amount: number
    currency: string
    status: string // SUCCESS, PENDING, FAIL
    payTime: string
  }
}

export class OpayService {
  private static generateSignature(data: Record<string, any>): string {
    const crypto = require('crypto')
    const sortedKeys = Object.keys(data).sort()
    const signatureString = sortedKeys
      .map((key) => `${key}=${data[key]}`)
      .join('&')
    
    return crypto
      .createHmac('sha512', OPAY_SECRET_KEY)
      .update(signatureString)
      .digest('hex')
  }

  static async initializePayment(
    params: InitializePaymentParams
  ): Promise<InitializePaymentResponse> {
    try {
      const payload = {
        merchantId: OPAY_MERCHANT_ID,
        ...params,
      }

      const signature = this.generateSignature(payload)

      const response = await axios.post<InitializePaymentResponse>(
        `${OPAY_BASE_URL}/api/v3/cashier/initialize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${OPAY_PUBLIC_KEY}`,
            MerchantId: OPAY_MERCHANT_ID,
            Signature: signature,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error('OPay initialization error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to initialize OPay payment')
    }
  }

  static async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResponse> {
    try {
      const payload = {
        merchantId: OPAY_MERCHANT_ID,
        ...params,
      }

      const signature = this.generateSignature(payload)

      const response = await axios.post<VerifyPaymentResponse>(
        `${OPAY_BASE_URL}/api/v3/cashier/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${OPAY_PUBLIC_KEY}`,
            MerchantId: OPAY_MERCHANT_ID,
            Signature: signature,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error('OPay verification error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to verify OPay payment')
    }
  }

  static verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto')
    const hash = crypto
      .createHmac('sha512', OPAY_SECRET_KEY)
      .update(payload)
      .digest('hex')
    return hash === signature
  }
}
