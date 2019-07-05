import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { header, menu, goodBye, menu2 } from './PrinterImage';
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
      isImport,
      type: 'import',
      debt: number
  }
  */

const longDash = '──────────────────────\r\n';
const shortDash = '───────────  \r\n';
const specialConfig = [21, 1, 6, 16];
function formatPrice(price) {
  const p = `${price}`;
  if ((p.substr(0, 1) === '-' && p.length <= 4) || (p.substr(0, 0) !== '-' && p.length <= 3)) {
    return `${p}.000 VND`;
  }
  return `${p.substring(0, p.length - 3)}.${p.substring(p.length - 3, p.length)}.000 VND`;
}
function formatQuantity(quantity) {
  return `${quantity} cai`;
}


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


  try {
    await BluetoothEscposPrinter.printPic(header, { width: 480 });
    await BluetoothEscposPrinter.printText('\r\n', {});
  } catch (error) {
  }

  await BluetoothEscposPrinter.printText('DC: 44 Le Minh Xuan - P.8 - Q.TB - TP.HCM\r\n', CONFIG_NORMAL);
  await BluetoothEscposPrinter.printText('DT: 0905.182225 - 0909.841215\r\n', CONFIG_NORMAL);
  await BluetoothEscposPrinter.printText('CHK: D.T.KIM LIEN - NH.Agribank: 6360205343197\r\n', CONFIG_NORMAL);
  await BluetoothEscposPrinter.printText('CHK: D.T.KIM LIEN - NH.Sacombank: 060041625891\r\n', CONFIG_NORMAL);

  await BluetoothEscposPrinter.printText(longDash, {});

  try {
    await BluetoothEscposPrinter.printPic(menu2, { width: 400 });
    await BluetoothEscposPrinter.printText('\r\n', {});
  } catch (error) {
  }

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
  await BluetoothEscposPrinter.printText(`  Thoi gian: ${data.date}\r\n`, {});
  if (data.customerName) {
   const text = `Khach hang: ${data.customerName}`;
    if (data.customerPhone) {
      text.concat(`- DT: ${data.customerPhone}`);
    }
    await BluetoothEscposPrinter.printText(text, CONFIG_NORMAL);
    await BluetoothEscposPrinter.printText('\r\n', CONFIG_NORMAL);
  }

  await BluetoothEscposPrinter.printText(`Nhan vien: ${data.thungan}\r\n`, {});


  const columnWidths = [6, 16, 10, 16];

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
  await BluetoothEscposPrinter.printText(longDash, {});


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

  await BluetoothEscposPrinter.printText('\r\n', {});
  // await BluetoothEscposPrinter.printText(data.isImport ? '  Nhap hang\r\n' : '  Mua hang\r\n', CONFIG_NORMAL);

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
        [`${i + 1} `, formatPrice(item.price), formatQuantity(item.quantity), formatPrice(total)],
        {}
      );
    } else {
      isHavePayBack = true;
    }
  }


  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
  await BluetoothEscposPrinter.printText(shortDash, {});
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
  await BluetoothEscposPrinter.printColumn(
    [16, 6, 10, 16],
    [
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER
    ],
    [data.type === 'import' ? 'Nhap hang' : 'Mua hang', '', formatQuantity(totalQuantity), formatPrice(totalCount)],
    {}
  );

  if (isHavePayBack) {
    // await BluetoothEscposPrinter.printText('\r\n', {});
    // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
    // await BluetoothEscposPrinter.printText('  Tra hang\r\n\r\n', CONFIG_NORMAL);
    // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText('\r\n\r\n', CONFIG_NORMAL);
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
          [`${i + 1 - buyNumberProduct} `, formatPrice(item.price), formatQuantity(-item.quantity), formatPrice(-total)],
          {}
        );
      }
    }

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
    await BluetoothEscposPrinter.printText(shortDash, {});
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

    await BluetoothEscposPrinter.printColumn(
      [16, 6, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER
      ],
      ['Tra hang', '', formatQuantity(totalQuantity), formatPrice(totalCount)],
      {}
    );
  }


  if (isHavePayBack || data.discount || data.otherCost || data.debt) {
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(longDash, {});
    await BluetoothEscposPrinter.printColumn(
      [21, 1, 6, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['   Tong cong: ', '', '', formatPrice(data.preCost)],
      {}
    );
  }


  const discount = data.discount > 0 ? formatPrice(data.discount) : '0 VND';
  const otherCost = data.otherCost > 0 ? formatPrice(data.otherCost) : '0 VND';


  if (parseInt(data.discount, 10) > 0) {
    await BluetoothEscposPrinter.printColumn(
      specialConfig,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['   Giam gia: ', '', '', `-${discount}`],
      {}
    );
  }

  if (parseInt(data.otherCost, 10) > 0) {
    await BluetoothEscposPrinter.printColumn(
      specialConfig,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['   Chi phi khac: ', '', '', `+${otherCost}`],
      {}
    );
  }

  if (parseInt(data.discount, 10) > 0 || parseInt(data.otherCost, 10) > 0) {
    await BluetoothEscposPrinter.printColumn(
      specialConfig,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['   Tong thanh tien ', '', '', formatPrice(data.totalCost)],
      {}
    );
  }

  if (data.debt) {
    await BluetoothEscposPrinter.printColumn(
      specialConfig,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['   Tien no ', '', '', formatPrice(data.debt)],
      {}
    );
  }


  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
  await BluetoothEscposPrinter.printText(longDash, {});
  try {
    await BluetoothEscposPrinter.printPic(goodBye, { width: 520 });
    await BluetoothEscposPrinter.printText('\r\n', {});
  } catch (error) {
  }
  await BluetoothEscposPrinter.printText(longDash, {});
  await BluetoothEscposPrinter.printText('\r\n', {});

  if (data.id) {
    const fakeId = !isNaN(data.id) ? parseInt(data.id, 10) * 123579 : data.id;
    await BluetoothEscposPrinter.printBarCode(fakeId, BluetoothEscposPrinter.BARCODETYPE.CODE128, 3, 120, 0, 2);
  }
  await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
};

export { printBill };
