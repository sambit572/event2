import React from "react";

/**
 * @param {{currentStep: number}} props - The props for the component.
 * @param {number} props.currentStep - The index of the current active step (0-based).
 */
function StepProgress({ currentStep }) {
  const steps = [
    { label: "Registration", subLabel: "Step 1", icon: "/verify.png" },
    { label: "Service Detail", subLabel: "Step 2", icon: "/service.png" },
    { label: "Bank Detail", subLabel: "Step 3", icon: "/payment.png" },
    { label: "Legal Consents", subLabel: "Step 4", icon: "/legal.png" },
  ];

  return (
    <div className="flex w-full items-start p-2 md:p-6 lg:p-8">
      {steps.map((step, index) => (
        <div className="relative flex-1 flex flex-col items-center" key={index}>
          {/* Connecting Line (Adjusted Width) */}
          {index < steps.length - 1 && (
            <div
              className="
                absolute bg-black z-0 transform -translate-y-1/2
                /* Base (Desktop) - Adjusted width */
                top-[50%] left-[calc(50%+30px)] h-[3px] w-[calc(100%-45px)]
                /* Tablet - Adjusted width */
                max-lg:left-[calc(50%+32.5px)] max-lg:w-[calc(100%-50px)]
                max-md:top-[48%] max-md:left-[calc(50%+25px)] max-md:h-[2px] max-md:w-[calc(100%-40px)]
                /* Mobile - Adjusted width */
                max-sm:left-[calc(50%+20px)] max-sm:w-[calc(100%-30px)]
                /* iPhone SE - Adjusted width */
                max-[375px]:left-[calc(50%+17.5px)] max-[375px]:w-[calc(100%-25px)]
                /* Galaxy Fold - Adjusted width */
                max-[400px]:left-[calc(50%+16px)] max-[400px]:w-[calc(100%-22px)]
                /* Very Small Phones - Adjusted width */
                max-[320px]:h-[1px] max-[320px]:left-[calc(50%+15px)] max-[320px]:w-[calc(100%-20px)]
              "
            ></div>
          )}

          {/* Step Label */}
          <div
            className="
              font-bold whitespace-nowrap
              /* Base (Desktop) */
              text-base mb-1.5
              /* Large Desktop */
              xl:text-[1.1rem]
              /* Tablet */
              max-md:text-sm max-md:mb-1
              /* Mobile */
              max-sm:text-xs
              /* iPhone SE */
              max-[375px]:text-[0.7rem]
              /* Galaxy Fold */
              max-[400px]:text-[0.65rem]
              /* Very Small Phones */
              max-[320px]:text-[0.6rem]
            "
          >
            {step.label}
          </div>

          {/* Step Circle (Added flex-shrink-0) */}
          <div
            className={`
              relative z-10 my-1 flex items-center justify-center rounded-full transition-colors duration-300 **flex-shrink-0**
              ${currentStep === index ? "bg-[#91e35b] border-[#91e35b]" : "bg-white border-black"}
              
              /* Base (Desktop) */
              w-[60px] h-[60px] border-[3px]
              /* Large Desktop */
              xl:w-[70px] xl:h-[70px]
              /* Tablet */
              max-lg:w-[65px] max-lg:h-[65px]
              max-md:w-[50px] max-md:h-[50px] max-md:border-2
              /* Mobile */
              max-sm:w-10 max-sm:h-10
              /* iPhone SE */
              max-[375px]:w-[35px] max-[375px]:h-[35px]
              /* Galaxy Fold */
              max-[400px]:w-8 max-[400px]:h-8
              /* Very Small Phones */
              max-[320px]:w-[30px] max-[320px]:h-[30px] max-[320px]:border
            `}
          >
            <img
              src={step.icon}
              alt={step.label}
              className="
                /* Base (Desktop) */
                w-[30px] h-[30px]
                /* Large Desktop */
                xl:w-[35px] xl:h-[35px]
                /* Tablet */
                max-lg:w-[32px] max-lg:h-[32px]
                max-md:w-[25px] max-md:h-[25px]
                /* Mobile */
                max-sm:w-5 max-sm:h-5
                /* iPhone SE */
                max-[375px]:w-[18px] max-[375px]:h-[18px]
                /* Galaxy Fold */
                max-[400px]:w-4 max-[400px]:h-4
                /* Very Small Phones */
                max-[320px]:w-[15px] max-[320px]:h-[15px]
              "
            />
          </div>

          {/* Step Sub-Label */}
          <div
            className="
              bg-gray-100 rounded-lg
              /* Base (Desktop) */
              text-xs px-2.5 py-1
              /* Tablet */
              max-md:text-[0.7rem] max-md:px-2 max-md:py-0.5
              /* Mobile */
              max-sm:text-[0.65rem] max-sm:px-1.5
              /* iPhone SE */
              max-[375px]:text-[0.6rem]
              /* Galaxy Fold */
              max-[400px]:text-[0.55rem]
              /* Very Small Phones */
              max-[320px]:text-[0.5rem]
            "
          >
            {step.subLabel}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StepProgress;