// tests/unit/components/home/HomeItem.test.js
import { mount } from '@vue/test-utils'
import HomeItem from '@/components/home/HomeItem.vue'

describe('HomeItem.vue', () => {
    test('renders with default props', () => {
        const wrapper = mount(HomeItem, {
            global: {
                stubs: {
                    'router-link': {
                        template: '<div class="router-link-stub"><slot /></div>'
                    }
                }
            }
        })
        expect(wrapper.text()).toContain('Pandemetrix')
        expect(wrapper.text()).toContain('pandemic predictive model')
    })

    test('renders with custom props', () => {
        const wrapper = mount(HomeItem, {
            props: {
                title: 'Custom Title',
                subtitle: 'Custom Subtitle'
            },
            global: {
                stubs: {
                    'router-link': {
                        template: '<div class="router-link-stub"><slot /></div>'
                    }
                }
            }
        })
        expect(wrapper.text()).toContain('Custom Title')
        expect(wrapper.text()).toContain('Custom Subtitle')
    })

    test('receives gradient prop', () => {
        const wrapper = mount(HomeItem, {
            props: {
                gradiant: 'bg-red-500'
            }
        })
        expect(wrapper.props('gradiant')).toBe('bg-red-500')
    })
})