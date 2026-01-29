import type { Handler } from "@netlify/functions"
import axios from "axios"

export const handler: Handler = async (event) => {
  try {
    const { id, ...restParams } = event.queryStringParameters || {}

    const url = id
      ? `${process.env.VITE_API_BASE_URL}products/${id}`
      : `${process.env.VITE_API_BASE_URL}products`

    const response = await axios.get(url, {
      params: id ? undefined : restParams,
      headers: {
        Authorization: `Bearer ${process.env.VITE_API_KEY}`,
      },
    })

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response.data),
    }
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(
        error.response?.data || {
          message: "Failed to fetch product(s)",
        }
      ),
    }
  }
}
