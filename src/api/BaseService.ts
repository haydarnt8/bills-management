import axiosIns from '@/plugins/axios'

// TODO: Use this service for the entire project

interface Options {
  config?: any
}

const getHeaderContentType = (data: object) => ({
  'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
})

export const baseService = {
  async get(url: string, params?: object, options?: Options): Promise<object | null> {
    const result = await axiosIns.get(url, { params })

    return result.data
  },
  async create(url: string, data: object, options?: Options): Promise<object | null> {
    const headers = { ...getHeaderContentType(data) }

    const result = await axiosIns.post(url, data, { headers })

    return result.data
  },
  async updateById(
    url: string,
    id: string | number,
    data: object,
    options?: Options,
  ): Promise<object | null> {
    const headers = { ...getHeaderContentType(data) }

    const result = await axiosIns.put(`${url}/${id}`, data, { headers })

    return result.data
  },
  async update(url: string, data: object, options?: Options): Promise<object | null> {
    const headers = { ...getHeaderContentType(data) }

    const result = await axiosIns.put(url, data, { headers })

    return result.data
  },
  async delete(url: string, id?: string | number, options?: Options): Promise<boolean | null> {
    if (id !== undefined && id != null) url += `/${id}`

    await axiosIns.delete(`${url}`)

    return true
  },
}
