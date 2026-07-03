import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DeliveryForm {
  name: string; email: string; phone: string
  address: string; city: string; zip: string
}

export const useCheckoutStore = defineStore('checkout', () => {
  const delivery = ref<DeliveryForm>({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
  })

  function save(data: DeliveryForm) {
    delivery.value = { ...data }
  }

  function clear() {
    delivery.value = { name: '', email: '', phone: '', address: '', city: '', zip: '' }
  }

  const hasData = () => !!delivery.value.name

  return { delivery, save, clear, hasData }
})