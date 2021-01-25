/**
 * Fetch API for data
 *
 * @param {string} prefix - uri (starts with /)
 * @param {string} method - HTTP method
 * @param {object} body - request body
 * @param {function} response_callback - callback function when receive response
 *
 */
export const fetchApi = (prefix, method, body, response_callback) => {

    const url = process.env.NEXT_PUBLIC_API_HOST + prefix + ((method === 'GET') ?  ('?' + new URLSearchParams(body)) : '')

    fetch( url, {
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: (method === 'GET') ?  null : new URLSearchParams(body)
            })
            .then(r => r.json())
            .then(response_callback)

}
