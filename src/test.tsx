import * as React from 'react'
import * as ReactDOM from 'react-dom'
export default {
    alert() {
        let element = document.createElement('div')
        document.body.appendChild(element)
        ReactDOM.render(<div>
            Test
        </div>, element)
    }
}