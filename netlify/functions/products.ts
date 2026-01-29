import type { Handler } from "@netlify/functions"
import axios from "axios"

export const handler: Handler = async (event) => {
  try {
    const response = await axios.get(
      `${process.env.VITE_API_BASE_URL}products`,
      {
        params: event.queryStringParameters,
        headers: {
          Authorization: `Bearer ${process.env.VITE_API_KEY}`,
        },
      }
    )

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
      body: JSON.stringify({
        message: "Failed to fetch products",
      }),
    }
  }
}
