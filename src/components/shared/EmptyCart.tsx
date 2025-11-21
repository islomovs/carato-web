import Image from "next/image";
import { Button } from "../ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-430px)]">
      <Image
        src="/icons/shopping-bag-grey.svg"
        alt="Empty cart"
        width={80}
        height={80}
        className="text-[#CDD5DF]"
      />
      <p className="mt-3 text-xl font-medium">Нет товаров в корзине</p>
      <p className="mt-3 text-sm font-normal">
        Выберите товары для покупки и они
        <br />
        отобразятся здесь для дальнейшей покупки
      </p>
      <Button
        variant="default"
        className="mt-9 uppercase text-sm font-normal py-2 px-3 rounded-md"
      >
        Перейти в каталог
      </Button>
    </div>
  );
}
