 const orderConfirmationEmailTemplate = (username, order) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" bgcolor="#f4f4f7" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 10px;">
        <table bgcolor="#ffffff" style="max-width:600px; width:100%; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <tr>
            <td align="center" bgcolor="#4f46e5" style="padding:24px; color:#ffffff; font-size:22px; font-weight:bold;">
              Thank you for your order!
            </td>
          </tr>

          <tr>
            <td style="padding:24px; font-size:16px; color:#333333;">
              <p>Hello <strong>${username}</strong>,</p>
              <p>We have received your order <strong>#${order._id}</strong>.</p>

              <h3 style="margin:20px 0 10px 0; font-size:18px; color:#4f46e5;">Order Details:</h3>
              <table width="100%" cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tr style="background-color:#f4f4f7;">
                  <th align="left">Product</th>
                  <th align="center">Qty</th>
                  <th align="right">Price</th>
                </tr>
                ${order.products.map(p => `
                  <tr>
                    <td>${p.productTitle}</td>
                    <td align="center">${p.quantity}</td>
                    <td align="right">₹${p.price}</td>
                  </tr>
                `).join('')}
                <tr style="border-top:1px solid #dddddd;">
                  <td colspan="2" align="right" style="font-weight:bold;">Total:</td>
                  <td align="right" style="font-weight:bold;">₹${order.totalAMT}</td>
                </tr>
              </table>

              <h3 style="margin:20px 0 10px 0; font-size:18px; color:#4f46e5;">Delivery Address:</h3>
              <p style="margin:0 0 10px 0;">${order.deliveryAddress.address_line}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}, ${order.deliveryAddress.state}, ${order.deliveryAddress.country}</p>

              <p style="margin:20px 0 10px 0;">Estimated Delivery Date: <strong>${new Date(order.estimatedDelivery).toLocaleDateString()}</strong></p>

              <p style="margin-top:30px;">If you have any questions, contact our support team.</p>
              <p style="margin-top:20px;">Best regards,<br/>Mart Ai Grocery Store</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px; font-size:12px; color:#999999;">
              &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
export default orderConfirmationEmailTemplate;