import Image from "next/image";

export default function CatalogPage() {
  return (
    <div className="mt-[97px] mb-8">
      <div className="grid grid-cols-2 gap-3 px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
          <div
            key={i}
            className="cursor-pointer aspect-square bg-[#EAECF0] hover:bg-[#D1D5DB] active:bg-[#C1C5D1] transition duration-300 p-3 rounded-md flex flex-col justify-between overflow-hidden"
          >
            {/* Text */}
            <p className="font-medium text-base leading-snug line-clamp-2">
              Посмотреть всю продукцию
            </p>

            {/* Image wrapper MUST be relative */}
            <div className="relative ml-auto -mr-3 -mb-3 w-[140px] sm:w-[120px] md:w-[140px] aspect-square">
              <Image
                src="/images/c-1.png"
                alt="Category"
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
