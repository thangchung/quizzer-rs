'use strict'

window.onload = () => {
    let conn = null

    const log = (msg) => {
        div_log.innerHTML += msg + '<br>'
        div_log.scroll(0, div_log.scrollTop + 1000)
    }

    const connect = () => {
        disconnect()

        const wsUri =
            (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
            window.location.host +
            '/ws-chat/'

        conn = new WebSocket(wsUri)
        log('Connecting...')

        conn.onopen = function () {
            log('Connected.')
            update_ui()
        }

        conn.onmessage = function (e) {
            log('Received: ' + e.data)
        }

        conn.onclose = function () {
            log('Disconnected.')
            conn = null

            update_ui()
        }
    }

    const disconnect = () => {
        if (conn) {
            log('Disconnecting...')
            conn.close()
            conn = null

            update_ui()
        }
    }

    const update_ui = () => {
        if (!conn) {
            span_status.textContent = 'disconnected'
            btn_connect.textContent = 'Connect'
        }
        else {
            span_status.textContent = `connected (${conn.protocol})`
            btn_connect.textContent = 'Disconnect'
        }
    }

    btn_connect.onclick = () => {
        if (!conn) {
            connect()
        }
        else {
            disconnect()
        }

        update_ui()
    }

    btn_send.onclick = () => {
        if (!conn) return

        const text = input_text.value
        if (text.length === 0) {
            return
        }
        log('Sending: ' + text)
        conn.send(text)

        input_text.value = ''
        input_text.focus()
    }

    input_text.onkeyup = (e) => {
        if (e.key === 'Enter') {
            btn_send.click()
        }
    }
}
