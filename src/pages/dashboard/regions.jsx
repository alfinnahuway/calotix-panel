import {
  CardBody,
  Typography,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
  IconButton,
  Tooltip,
  Alert,
  CardFooter,
} from "@material-tailwind/react";
import { PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import validator from "validator";

const Regions = () => {
  const [regions, setRegions] = useState([]);
  const [regInput, setRegInput] = useState("");
  const [errorReg, setErrorReg] = useState("");
  const [open, setOpen] = useState(false);

  const getAllDataRegion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/regions/fetch"
      );
      setRegions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDataRegion();
  }, []);

  const validateFormData = () => {
    const isValid = validator.isLength(regInput, { min: 1 });
    setErrorReg(isValid);
    return isValid;
  };

  const handleSubmit = async () => {
    const validResult = validateFormData();
    if (!validResult) {
      return;
    }
    try {
      const regData = {
        region_city: regInput,
      };
      const response = await axios.post(
        "http://localhost:8080/api/regions/create",
        regData
      );

      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      alert("Berhasil Input");
      getAllDataRegion();
      setOpen(!open);
    }
  };

  const handleOpen = () => {
    setRegInput("");
    setErrorReg("");
    setOpen(!open);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="orange" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Regions
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="ml-4 w-32">
            <Button
              onClick={handleOpen}
              size="sm"
              className="flex w-full items-center justify-between"
              color="orange"
            >
              <PlusIcon strokeWidth={2.5} className="h-5 w-5" /> Add Event
            </Button>

            <Dialog open={open} handler={handleOpen} size="md">
              <DialogHeader>Add Region</DialogHeader>

              <DialogBody divider>
                <div className="w-full">
                  <Input
                    type="text"
                    label="Region"
                    name="region"
                    value={regInput}
                    onChange={(e) => setRegInput(e.target.value)}
                    error={errorReg === false}
                  />
                  {errorReg === false && (
                    <p className="-mb-3 p-1 text-xs text-red-500">
                      Region is required
                    </p>
                  )}
                </div>
              </DialogBody>

              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="text-center">
                {["no.", "region", "", ""].map((el, i) => (
                  <th
                    key={i}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regions?.map(({ region_city }, indexRow) => {
                const rowOrder = indexRow + 1;
                return (
                  <tr>
                    <td className="px-5">{rowOrder}</td>
                    <td className="px-5">{region_city}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Regions;
