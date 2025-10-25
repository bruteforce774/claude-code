// const doRequest = async verb => async body => async index => {
//     const pre = !index ? '' : `/${index}`;
//     await fetch(`/api/items${pre}`, {
//         method: verb,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//     });

//     const data = await res.json();
//     return data;
// }

const api = {
    get: async (url) => (await axios.get(url)).data,
    post: async (url, body) => (await axios.post(url, body)).data,
    put: async (url, body) => (await axios.put(url, body)).data,
    delete: async (url) => (await axios.delete(url)).data,

    // get: doRequest('GET', null),
    // post: (index, body) => doRequest('POST')(body)(index),
    // put: (index, body) => doRequest('PUT')(body)(index),
    // delete: doRequest('DELETE', null),
};
