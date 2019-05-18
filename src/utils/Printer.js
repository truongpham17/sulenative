import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

/*

  data: {
      id: string,
      customer: string,
      thungan: string,
      date: dd/MM/YYYY
      productList: {
          price, quantity, total
      },
      totalQuantity: string,
      totalCost: string // format to string {1.000},
      discount: number
  }
  */
const printBill = async data => {
  console.log(data.productList);
  await BluetoothEscposPrinter.printerInit();
  await BluetoothEscposPrinter.printerLeftSpace(0);
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
  await BluetoothEscposPrinter.setBlob(0);

  await BluetoothEscposPrinter.printText('DUNG LIEN\r\n', {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 2,
    heigthtimes: 2,
    fonttype: 0
  });
  await BluetoothEscposPrinter.printText('DC: 44 Le Minh Xuan - P.8 - Q.TB - TP.HCM\r\n', {});
  await BluetoothEscposPrinter.printText('DT: 0905.182225 - 0909.841215\r\n', {});
  await BluetoothEscposPrinter.printText('CHK: N.T.TRAM ANH - NH.Agribank: 636020534\r\n', {});
  await BluetoothEscposPrinter.printText('CHK: N.T.TRAM ANH - NH.Sacombank: 60618762\r\n', {});

  await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});

  await BluetoothEscposPrinter.printText('HOA DON\r\n', {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 2,
    heigthtimes: 2,
    fonttype: 0
  });
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
  // await BluetoothEscposPrinter.printerLeftSpace(10);
  await BluetoothEscposPrinter.printText(`ID: ${data.id} - Thoi gian: ${data.date}\r\n`, {});
  await BluetoothEscposPrinter.printText(`Khach hang: ${data.customer || 'UNKNOWN'}\r\n`, {});
  await BluetoothEscposPrinter.printText(`Nhan vien: ${data.thungan}\r\n\r\n`, {});
  const columnWidths = [6, 16, 10, 16];

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT
    ],
    ['STT', 'Don gia', 'So luong', 'Thanh tien'],
    {}
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  for (let i = 0; i < data.productList.length; i++) {
    const item = data.productList[i];
    const total = item.price * item.quantity;
    await BluetoothEscposPrinter.printColumn(
      columnWidths,
      [
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      [`${i + 1} `, `${item.price}.000 VND`, `${item.quantity} cai`, `${total}.000 VND`],
      {}
    );
  }

  await BluetoothEscposPrinter.printText('\r\n', {});
  //   await BluetoothEscposPrinter.printColumn(
  //     [16, 6, 10, 16],
  //     [
  //       BluetoothEscposPrinter.ALIGN.LEFT,
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //       BluetoothEscposPrinter.ALIGN.RIGHT
  //     ],
  //     ['Tong cong', '', `${data.totalQuantity} cai`, `${data.totalCost}.000 VND`],
  //     {}
  //   );

  const discount = data.discount > 0 ? `${data.discount}.000 VND` : '0 VND';
  const otherCost = data.otherCost > 0 ? `${data.otherCost}.000 VND` : '0 VND';
  await BluetoothEscposPrinter.printColumn(
    [16, 20],
    [BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
    ['Tong so luong', `${data.totalQuantity} cai`],
    {}
  );

  await BluetoothEscposPrinter.printColumn(
    [16, 20],
    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
    ['Giam gia', discount],
    {}
  );

  await BluetoothEscposPrinter.printColumn(
    [16, 20],
    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
    ['Chi phi khac', otherCost],
    {}
  );
  await BluetoothEscposPrinter.printColumn(
    [16, 20],
    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
    ['Tong thanh tien', `${data.totalCost}.000 VND`],
    {}
  );

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

  await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});
  await BluetoothEscposPrinter.printText('LUU Y: Khi doi tra hang nho mang theo hoa don\r\n', {});
  await BluetoothEscposPrinter.printText('HEN GAP LAI QUY KHACH!\r\n', {});
  await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});
  await BluetoothEscposPrinter.printText('\r\n\r\n\r\n\r\n', {});
};

export { printBill };
