import { ArrowUpIcon, StopwatchIcon } from "@radix-ui/react-icons";

export default function Task() {
  const markdown = `# Markdown Example

  ## Headings
  Markdown supports different heading levels:
  ### Heading 3
  #### Heading 4
  
  ## Lists
  You can create ordered lists and unordered lists:
  1. Ordered List Item 1
  2. Ordered List Item 2
     - Unordered Subitem 1
     - Unordered Subitem 2
  
  - Unordered List Item A
  - Unordered List Item B
  
  ## Text Formatting
  You can format text as **bold**, *italic*, or code
  - This is **bold text**.
  - This is *italic text*.
  - This is inline.
`;

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-14">
        <div className="flex items-start">
          <div className="w-[800px]">
            <div className="text-2xl font-bold tracking-tight">
              Prototyping from A to Z: best practices for successful prototypes
            </div>
            <div className="flex items-center space-x-4 pt-2 pb-5">
              <div className="text-sm text-muted-foreground">
                Created on August 3, 2022, 2:20am
              </div>
              <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                Bug
              </span>
              <span className="text-gray-800 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded border border-gray-500">
                <StopwatchIcon className="text-orange-600 mr-1.5" />
                In Progress
              </span>
              <span className="text-gray-800 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded border border-gray-500">
                <ArrowUpIcon className="text-red-600 mr-1.5" /> High
              </span>
            </div>
            <div className="">
              <div className="p-3 text-xl font-thin text-gray-700">
                <p>
                  Flowbite is an open-source library of UI components built with
                  the utility-first classes from Tailwind CSS. It also includes
                  interactive elements such as dropdowns, modals, datepickers.
                </p>
                <p>
                  Before going digital, you might benefit from scribbling down
                  some ideas in a sketchbook. This way, you can think things
                  through before committing to an actual design project.
                </p>
                <p>
                  But then I found a{" "}
                  <a href="https://flowbite.com">
                    component library based on Tailwind CSS called Flowbite
                  </a>
                  . It comes with the most commonly used UI components, such as
                  buttons, navigation bars, cards, form elements, and more which
                  are conveniently built with the utility classes from Tailwind
                  CSS.
                </p>
                <figure>
                  <figcaption>Digital art by Anonymous</figcaption>
                </figure>
                <h2>Getting started with Flowbite</h2>
                <p>
                  First of all you need to understand how Flowbite works. This
                  library is not another framework. Rather, it is a set of
                  components based on Tailwind CSS that you can just copy-paste
                  from the documentation.
                </p>
                <p>
                  It also includes a JavaScript file that enables interactive
                  components, such as modals, dropdowns, and datepickers which
                  you can optionally include into your project via CDN or NPM.
                </p>
                <p>
                  You can check out the{" "}
                  <a href="https://flowbite.com/docs/getting-started/quickstart/">
                    quickstart guide
                  </a>{" "}
                  to explore the elements by including the CDN files into your
                  project. But if you want to build a project with Flowbite I
                  recommend you to follow the build tools steps so that you can
                  purge and minify the generated CSS.
                </p>
                <p>
                  You will also receive a lot of useful application UI,
                  marketing UI, and e-commerce pages that can help you get
                  started with your projects even faster. You can check out this
                  to better understand the differences between the open-source
                  and pro version of Flowbite.
                </p>
                <h2>When does design come in handy?</h2>
                <p>
                  While it might seem like extra work at a first glance, here
                  are some key moments in which prototyping will come in handy:
                </p>
                <ol>
                  <li>
                    <strong>Usability testing</strong>. Does your user know how
                    to exit out of screens? Can they follow your intended user
                    journey and buy something from the site you’ve designed? By
                    running a usability test, you’ll be able to see how users
                    will interact with your design once it’s live;
                  </li>
                  <li>
                    <strong>Involving stakeholders</strong>. Need to check if
                    your GDPR consent boxes are displaying properly? Pass your
                    prototype to your data protection team and they can test it
                    for real;
                  </li>
                  <li>
                    <strong>Impressing a client</strong>. Prototypes can help
                    explain or even sell your idea by providing your client with
                    a hands-on experience;
                  </li>
                  <li>
                    <strong>Communicating your vision</strong>. By using an
                    interactive medium to preview and test design elements,
                    designers and developers can understand each other — and the
                    project — better.
                  </li>
                </ol>
                <h3>Laying the groundwork for best design</h3>
                <p>
                  Before going digital, you might benefit from scribbling down
                  some ideas in a sketchbook. This way, you can think things
                  through before committing to an actual design project.
                </p>
                <p>
                  Let&apos;s start by including the CSS file inside the{" "}
                  <code>head</code> tag of your HTML.
                </p>
                <h3>Understanding typography</h3>
                <h4>Type properties</h4>
                <p>
                  A typeface is a collection of letters. While each letter is
                  unique, certain shapes are shared across letters. A typeface
                  represents shared patterns across a collection of letters.
                </p>
                <h4>Baseline</h4>
                <p>
                  A typeface is a collection of letters. While each letter is
                  unique, certain shapes are shared across letters. A typeface
                  represents shared patterns across a collection of letters.
                </p>
                <h4>Measurement from the baseline</h4>
                <p>
                  A typeface is a collection of letters. While each letter is
                  unique, certain shapes are shared across letters. A typeface
                  represents shared patterns across a collection of letters.
                </p>
              </div>
            </div>
          </div>

          <div>2</div>
        </div>
      </div>
    </>
  );
}
