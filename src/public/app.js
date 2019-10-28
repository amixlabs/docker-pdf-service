/* eslint-disable no-new */
/* global Vue */
new Vue({
  el: '#app',
  data () {
    const urls = [
      'https://portal.primeenergy.com.br/pdf.html#!/pdf/gd?id_cnpj=32888119000139&route=gds&tp_un=&action=gerar&dt_fim=2019-09-28T03:00:00.000Z&dt_ini=2018-09-01T03:00:00.000Z',
      'https://portal.primeenergy.com.br/pdf.html#!/pdf/nd?dt_ref=2019-04-01T03:00:00.000Z&id_cnpj=32888119000139&id_consorciado=03835761000151&id_contratogd=34&route=nd'
    ]
    return {
      urls,
      form: {
        url: urls[0],
        headers: [
          {
            name: 'cookie',
            value: 'sessid=ed1213ea18468012ec499f7e57a385d7'
          },
          {
            name: 'user-agent',
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'
          },
          {
            name: 'x-pdf-options',
            value: '{"landscape": true}'
          },
          {
            name: 'x-wait-selector',
            value: 'body[report-end=true]'
          }
        ]
      },
      src: null,
      error: null,
      loading: false
    }
  },
  methods: {
    async submit () {
      this.src = null
      this.loading = true
      const { url, headers } = this.form
      this.$nextTick(() => {
        this.src = `${window.location}pdf?url=${encodeURIComponent(url)}&${
          headers.map(h => `${h.name.toLowerCase()}=${encodeURIComponent(h.value)}`).join('&')
        }`
      })
    },
    addHeader () {
      this.form.headers.push({ name: '', value: '' })
    },
    pdfLoad (event) {
      console.log({ pdfLoad: event })
      this.loading = false
    },
    pdfError (event) {
      console.error({ pdfError: event })
      this.loading = false
    },
    close () {
      this.src = null
      this.loading = false
    }
  }
})
