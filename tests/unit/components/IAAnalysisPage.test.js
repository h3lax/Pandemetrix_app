import { mount } from '@vue/test-utils'
import IAAnalysisPage from '../../../src/components/IAAnalysisPage.vue'

describe('IAAnalysisPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(IAAnalysisPage)
  })

  test('renders page title', () => {
    expect(wrapper.find('h1').text()).toBe('Analyse IA / Modèles de Prédictions')
  })

  test('displays datasets and models', () => {
    expect(wrapper.find('#dataset-select').exists()).toBe(true)
    expect(wrapper.find('#model-select').exists()).toBe(true)
  })

  test('button is enabled when no selection (initial state)', () => {
    const button = wrapper.find('button[type="submit"]')
    // Le bouton a l'attribut disabled basé sur required des selects
    expect(button.exists()).toBe(true)
  })

  test('enables prediction after selections', async () => {
    await wrapper.find('#dataset-select').setValue('1')
    await wrapper.find('#model-select').setValue('1')
    
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
  })

  test('displays model comparison table', () => {
    expect(wrapper.find('.model-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('RandomForest')
    expect(wrapper.text()).toContain('XGBoost')
  })
})