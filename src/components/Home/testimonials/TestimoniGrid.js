import React from "react";

const testimonials = [
  // Row 1
  {
    type: "stat",
    value: "10X",
    label: "Revenue Boost",
    logo: "/assets/images/brands/logo-01.svg",
    bg: "bg-[#FFF2E5]",
    pos: "lg:col-span-1 lg:row-start-1",
  },
  {
    type: "stat",
    value: "2X",
    label: "Increase Efficiency",
    logo: "/logo2.svg",
    bg: "bg-[#EDE3FF]",
    pos: "lg:col-span-1 lg:row-start-1",
  },
  {
    type: "testimonial",
    text: "Prismo has completely transformed how our team manages tasks. The platform has made our workflow seamless and boosted overall productivity.",
    author: "John Matthews",
    role: "Project Manager",
    avatar: "/avatars/john.png",
    pos: "lg:col-span-2 lg:row-start-1",
  },

  // Row 2
  {
    type: "testimonial",
    text: "With Prismo, we’ve streamlined our project management, reducing time spent on administrative tasks. It’s user-friendly, and our team is now more efficient than ever.",
    author: "Sarah Collins",
    role: "Operations Lead",
    avatar: "/avatars/sarah.png",
    pos: "lg:col-span-2 lg:row-start-2",
  },
  {
    type: "testimonial",
    text: "We saw a massive improvement in our team’s collaboration and communication. Prismo helped us organize tasks efficiently, leading to better outcomes across all projects.",
    author: "David Chen",
    role: "Team Lead",
    avatar: "/avatars/david.png",
    pos: "lg:col-span-2 lg:row-start-2",
  },

  // Row 3
  {
    type: "stat",
    value: "5X",
    label: "Team Growth",
    logo: "/logo3.svg",
    bg: "bg-[#EBFBEF]",
    pos: "lg:col-span-1 lg:row-start-3",
  },
  {
    type: "testimonial",
    text: "We’ve increased our efficiency by at least 40% since implementing Prismo. It’s helped our team stay aligned and deliver exceptional results.",
    author: "Olivia Turner",
    role: "Operations Director",
    avatar: "/avatars/olivia.png",
    pos: "lg:col-span-2 lg:row-start-3",
  },
  {
    type: "stat",
    value: "3X",
    label: "Increased Productivity",
    logo: "/logo4.svg",
    bg: "bg-[#FFE5E9]",
    pos: "lg:col-span-1 lg:row-start-3",
  },
];

const TestimoniGrid = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
      {testimonials.map((item, i) =>
        item.type === "stat" ? (
          <div
            key={i}
            className={`rounded-xl p-6 flex flex-col justify-between h-auto md:h-[260px] ${item.bg} ${item.pos}`}
          >
            <div>
              <h3 className="text-4xl font-bold text-gray-900">{item.value}</h3>
              <p className="text-gray-700 mt-1">{item.label}</p>
            </div>
            <div className="mt-6">
              <img
                src={item.logo}
                alt="logo"
                width={100}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <div
            key={i}
            className={`rounded-xl p-6 bg-white shadow-sm border h-auto md:h-[260px] border-gray-200 flex flex-col justify-between ${item.pos}`}
          >
            <p className="text-gray-800 leading-relaxed text-[15px]">“{item.text}”</p>
            <div className="flex items-center gap-3 mt-6">
              <img
                src={item.avatar}
                alt={item.author}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{item.author}</p>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TestimoniGrid;
