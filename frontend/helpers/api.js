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
    console.log('confMap NEXT_PUBLIC_API_HOST: ', process.env.NEXT_PUBLIC_API_HOST)
    console.log('confMap NEXT_PUBLIC_WS_HOST: ', process.env.NEXT_PUBLIC_WS_HOST)
    console.log('confMap NEXT_PUBLIC_FRONTEND_HOST: ', process.env.NEXT_PUBLIC_FRONTEND_HOST)
    console.log('confMap NEXT_PUBLIC_API_HOST2: ', process.env.NEXT_PUBLIC_API_HOST2)
    console.log('confMap NEXT_PUBLIC_TEST: ', process.env.NEXT_PUBLIC_TEST)
    console.log('confMap API_URL: ', process.env.API_URL)
    const url = process.env.NEXT_PUBLIC_API_HOST + prefix + ((method === 'GET') ?  ('?' + new URLSearchParams(body)) : '')

    fetch( url, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: (method === 'GET') ?  null : new URLSearchParams(body)
            })
            .then(r => r.json())
            .then(response_callback)

}

