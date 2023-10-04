import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewTask() {
  return (
    <>
      <div className="container mx-auto mt-4 px-5 pb-5 pt-12">
        <div className="text-2xl font-bold tracking-tight">New Task</div>
        <div className="flex items-start">
          <div className="w-[800px]">
            <form>
              <div className="space-y-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input type="title" id="title" placeholder="Title" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="select">Label</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="select">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="select">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={8}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write a product description here...">
                    Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7
                    processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4
                    memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB
                    SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard
                    - US
                  </textarea>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-black bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Update product
                </button>
                <button
                  type="button"
                  className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                  <svg
                    className="w-5 h-5 mr-1 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"></path>
                  </svg>
                  Delete
                </button>
              </div>{" "}
            </form>
          </div>
          <div className="">2</div>
        </div>
      </div>
    </>
  );
}
