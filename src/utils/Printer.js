import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

/*

  data: {
      id: string,
      customer: string,
      thungan: string,
      date: dd/MM/YYYY
      productList: {
          price, quantity : quantity can be - or +
      },
      totalQuantity: string,
      totalCost: string // format to string {1.000},
      discount: number,
      preCost,
      isImport
  }
  */


const printBill = async data => {
  console.log(data);

  const CONFIG_NORMAL = {
    encoding: 'GBK',
    codepage: '0',
    widthtimes: 0,
    heigthtimes: 0,
    fonttype: 1
  };

  await BluetoothEscposPrinter.printerInit();
  await BluetoothEscposPrinter.printerLeftSpace(0);
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
  await BluetoothEscposPrinter.setBlob(0);

  await BluetoothEscposPrinter.printText('DUNG LIEN\r\n', {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 2,
    heigthtimes: 2,
    fonttype: 1
  });
  await BluetoothEscposPrinter.printText('DC: 44 Le Minh Xuan - P.8 - Q.TB - TP.HCM\r\n', CONFIG_NORMAL);
  await BluetoothEscposPrinter.printText('DT: 0905.182225 - 0909.841215\r\n', CONFIG_NORMAL);
  await BluetoothEscposPrinter.printText('CHK: D.T.KIM LIEN - NH.Agribank: 6360205343197\r\n', CONFIG_NORMAL);
  await BluetoothEscposPrinter.printText('CHK: D.T.KIM LIEN - NH.Sacombank: 060041625891\r\n', CONFIG_NORMAL);

  await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});


  await BluetoothEscposPrinter.printText('HOA DON\r\n', {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 1,
    heigthtimes: 1,
    fonttype: 1
  });


  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
  await BluetoothEscposPrinter.printText(`  ID: ${data.id} - Thoi gian: ${data.date}\r\n`, {});
  await BluetoothEscposPrinter.printText(
    `  Khach hang: ${data.customerName || ''} - DT: ${data.customerPhone}\r\n`,
    CONFIG_NORMAL
  );
  await BluetoothEscposPrinter.printText(`  Nhan vien: ${data.thungan}\r\n\r\n`, {});
  const columnWidths = [6, 16, 10, 16];

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
 await BluetoothEscposPrinter.printerUnderLine(1);
    await BluetoothEscposPrinter.printText('                                     \r\n\r\n', CONFIG_NORMAL);
    await BluetoothEscposPrinter.printerUnderLine(0);

  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.RIGHT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER
    ],
    ['STT', 'Don gia', 'So luong', 'Thanh tien'],
    {}
  );

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
  await BluetoothEscposPrinter.printText('\r\n', {});


  await BluetoothEscposPrinter.printText(data.isImport ? '  Nhap hang\r\n\r\n' : '  Mua hang\r\n\r\n', CONFIG_NORMAL);

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);


  let totalCount = 0;
  let totalQuantity = 0;
  let buyNumberProduct = 0;
  let isHavePayBack = false;
  for (let i = 0; i < data.productList.length; i++) {
    const item = data.productList[i];
    if (parseInt(item.quantity, 10) > 0) {
      const total = item.price * item.quantity;
      buyNumberProduct++;
      totalCount += total;
      totalQuantity += item.quantity;
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER
        ],
        [`${i + 1} `, `${item.price}.000 VND`, `${item.quantity} cai`, `${total}.000 VND`],
        {}
      );
    } else {
      isHavePayBack = true;
    }
  }

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
  await BluetoothEscposPrinter.printerUnderLine(1);
     await BluetoothEscposPrinter.printText('                                     \r\n\r\n', CONFIG_NORMAL);
     await BluetoothEscposPrinter.printerUnderLine(0);


    await BluetoothEscposPrinter.printColumn(
      [16, 6, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER
      ],
      ['', '', `${totalQuantity} cái`, `${totalCount}.000 VND`],
      {}
    );

    // await BluetoothEscposPrinter.printText('\r\n', {});

    if (isHavePayBack) {
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
      await BluetoothEscposPrinter.printText('  Tra hang\r\n\r\n', CONFIG_NORMAL);
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

      totalCount = 0;
      totalQuantity = 0;

      for (let i = 0; i < data.productList.length; i++) {
        const item = data.productList[i];
        if (parseInt(item.quantity, 10) < 0) {
          totalQuantity += item.quantity;
          const total = item.price * item.quantity;
          totalCount += total;
          await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
              BluetoothEscposPrinter.ALIGN.RIGHT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.CENTER
            ],
            [`${i + 1 - buyNumberProduct} `, `${item.price}.000 VND`, `${-item.quantity} cai`, `${total}.000 VND`],
            {}
          );
        }
      }

      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printerUnderLine(1);
         await BluetoothEscposPrinter.printText('                                     \r\n\r\n', CONFIG_NORMAL);
         await BluetoothEscposPrinter.printerUnderLine(0);

      await BluetoothEscposPrinter.printColumn(
        [16, 6, 10, 16],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER
        ],
        ['', '', `${totalQuantity}`, `${totalCount}.000 VND`],
        {}
      );
    }


    await BluetoothEscposPrinter.printerUnderLine(1);
    await BluetoothEscposPrinter.printText('                                     \r\n\r\n', CONFIG_NORMAL);
    await BluetoothEscposPrinter.printerUnderLine(0);

  // await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});

  await BluetoothEscposPrinter.printColumn(
      [21, 1, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER
      ],
      ['   Tong cong: ', '', '', `${data.totalCost}.000 VND`],
      {}
    );


  const discount = data.discount > 0 ? `${data.discount}.000 VND` : '0 VND';
  const otherCost = data.otherCost > 0 ? `${data.otherCost}.000 VND` : '0 VND';


  if (parseInt(data.discount, 10) > 0) {
    await BluetoothEscposPrinter.printColumn(
      [21, 1, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER
      ],
      ['   Giam gia: ', '', '', -discount],
      {}
    );
  }

  if (parseInt(data.otherCost, 10) > 0) {
    await BluetoothEscposPrinter.printColumn(
      [21, 1, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER
      ],
      ['   Chi phi khac: ', '', '', `+${otherCost}`],
      {}
    );
  }

  if (parseInt(data.discount, 10) > 0 || parseInt(data.otherCost, 10) > 0) {
    await BluetoothEscposPrinter.printColumn(
      [21, 1, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER
      ],
      ['   Tong thanh tien ', '', '', `${data.totalCost}.000 VND`],
      {}
    );
  }

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
 await BluetoothEscposPrinter.printerUnderLine(1);
    await BluetoothEscposPrinter.printText('                                     \r\n\r\n', CONFIG_NORMAL);
    await BluetoothEscposPrinter.printerUnderLine(0);
  await BluetoothEscposPrinter.printText('LUU Y: Khi doi tra hang nho mang theo hoa don\r\n', {});
  await BluetoothEscposPrinter.printText('HEN GAP LAI QUY KHACH!\r\n', {});
  await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});
  await BluetoothEscposPrinter.printText('\r\n\r\n\r\n\r\n', {});
};

export { printBill };
