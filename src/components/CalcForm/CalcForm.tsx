import { useState, useEffect } from 'react'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'

import styles from './CalcForm.module.css'

type Currency = {
  name: string
  value: number
}

export const CalcForm = () => {
  const [tariff, setTariff] = useState(null)
  const [currency, setCurrencyValue] = useState(null)
  const [currencyList, setCurrency] = useState<Currency[]>([])
  const [period, setPeriod] = useState(null)

  const [paymentAmount, setPaymentAmount] = useState<number | null>(null)
  const [discountAmount, setDiscountAmount] = useState<number | null>(null)

  const apiToken = 'fxr_live_ae86206b21cf525670b1102c95a0ac55e70b'

  const tariffList = [
    { name: 'Стандартный', monthPlan: 100, yearPlan: 1000 },
    { name: 'Продвинутый', monthPlan: 150, yearPlan: 1400 },
  ]

  const fetchCurrency = async () => {
    try {
      const { data } = await axios.get(
        `https://api.fxratesapi.com/latest?base=RUB&currencies=KZT,CNY&format=json&apikey=${apiToken}`
      )
      const preparedData = Object.entries(data.rates).map(([key, value]) => ({
        name: key,
        rate: value,
      }))
      setCurrency(preparedData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCurrency()
  }, [])

  const calculatePayment = () => {
    if (!tariff || !currency || !period) {
      return // если не выбраны все параметры, не выполняем расчет
    }

    let price: number
    if (period === 'Месяц') {
      price = tariff.monthPlan
    } else if (period === 'Год') {
      price = tariff.yearPlan
    }

    // Преобразование цены в выбранную валюту
    const exchangeRate = currency.rate
    const paymentAmount = price * exchangeRate

    // Расчет скидки, если выбран годовой план
    let discountAmount = 0
    if (period === 'Год') {
      const monthlyPrice = tariff.monthPlan * exchangeRate
      discountAmount = monthlyPrice * 12 - paymentAmount
    }

    setPaymentAmount(paymentAmount)
    setDiscountAmount(discountAmount)
  }

  return (
    <div className={styles.root}>
      <p>Тариф</p>
      <Dropdown
        placeholder="Выберите тариф"
        value={tariff}
        options={tariffList}
        onChange={(e) => setTariff(e.value)}
        optionLabel="name"
      />
      <p>Валюта</p>
      <Dropdown
        placeholder="Выберите валюту"
        value={currency}
        options={currencyList}
        onChange={(e) => setCurrencyValue(e.value)}
        optionLabel="name"
      />
      <p>Период оплаты</p>
      <Dropdown
        placeholder="Выберите период"
        value={period}
        options={['Месяц', 'Год']}
        onChange={(e) => setPeriod(e.value)}
      />

      <Button label="Рассчитать" onClick={calculatePayment} />

      {paymentAmount !== null && (
        <div>
          <p>Сумма для оплаты: {paymentAmount.toFixed(2)}</p>
          {discountAmount !== null && (
            <p>Сумма скидки: {discountAmount.toFixed(2)}</p>
          )}
        </div>
      )}
    </div>
  )
}
