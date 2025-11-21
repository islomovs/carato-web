import Image from "next/image";
import { useState } from "react";
import AddressLayer from "../layout/AddressLayer";

export default function AddressSection() {
  const [addressLayer, setAddressLayer] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer flex items-center gap-4 py-2 md:p-6 md:bg-[#F8FAFC] md:hover:bg-[#EAF1F7]"
        onClick={() => setAddressLayer(true)}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-[#EEF2F6] rounded">
          <Image src="/icons/marker.svg" alt="marker" width={20} height={20} />
        </div>

        <div className="flex-1 text-left">
          <div className="text-[14px] font-light text-[#697586]">
            Адрес доставки
          </div>
          <div className="text-[16px] font-normal">Выберите адрес доставки</div>
        </div>

        <div className="w-6 h-6 flex items-center justify-center">
          <Image
            src="/icons/chevron-right.svg"
            alt=">"
            width={20}
            height={20}
          />
        </div>
      </div>
      <AddressLayer
        open={addressLayer}
        onClose={() => setAddressLayer(false)}
        onSelect={() => setAddressLayer(false)}
      />
    </>
  );
}
