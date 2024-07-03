import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  FormControl,
  Header,
  Heading,
  Modal,
  Note,
  Spinner,
  Text,
  TextInput,
} from "@contentful/f36-components";
import { createClient } from "contentful-management";
import UsageChart from "../components/Usage";
import ContentTypeAudit from "../components/ContentTypeAudit";

// TAM hub VV
// CFPAT-plNzS5XIS_Oa9z4SnIP0X2pZRhIXvwfD2gC2KiGaNoE
// org id: 1VvvAHJva5Hw3eCh3XHair
// cda key: kOp-SOcq8HLpCQSL81WG1T3FKh1SN7x3MSlM7N_We-k

function isCtOld(dateString: string) {
  const date = new Date(dateString);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return date < sixMonthsAgo;
}

const Page = () => {
  const [modal, setModal] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    CMAKey: "",
    OrgID: "",
    envID: "",
    spaceID: "",
  });
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ctData, setContentTypeData] = useState<any>(null);
  const [entryData, setEntryData] = useState<any>(null);
  const [publishedEntryData, setPublishedEntryData] = useState<any>(null);
  const [localeData, setLocaleData] = useState<any>(null);
  const [roleData, setRoleData] = useState<any>(null);
  const [apiUsage, setApiUsage] = useState<any>(null);
  const [oldCts, setOldCts] = useState([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  const fetchData = async () => {
    try {
      console.log("FORM DATA =", formData);

      const client = createClient(
        {
          accessToken: formData.CMAKey, // Use the key from formData
        },
        { type: "plain" }
      );

      const contentTypeData = await client.contentType.getMany({
        spaceId: formData.spaceID,
        environmentId: formData.envID,
      });

      const totalEntries = await client.entry.getMany({
        spaceId: formData.spaceID,
        environmentId: formData.envID,
      });

      const totalPublishedEntries = await client.entry.getPublished({
        spaceId: formData.spaceID,
        environmentId: formData.envID,
      });

      const totalLocales = await client.locale.getMany({
        spaceId: formData.spaceID,
        environmentId: formData.envID,
      });

      const totalRoles = await client.role.getMany({
        spaceId: formData.spaceID,
        environmentId: formData.envID,
      });

      const date = new Date();
      const startAt = new Date(date.getFullYear(), date.getMonth(), 1);
      const formatDate = (date: Date) =>
        `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const startAtFormatted = formatDate(startAt);
      const endAtFormatted = formatDate(date);

      const orgUsage = await client.usage.getManyForOrganization({
        organizationId: formData.OrgID,
        query: {
          skip: 0,
          limit: 10,
          "metric[in]": "cma,cda,gql,cpa",
          "dateRange.startAt": startAtFormatted,
          "dateRange.endAt": endAtFormatted,
        },
      });

      const contentTypes = contentTypeData.items.map((contentType) => ({
        id: contentType.sys.id,
        updatedAt: contentType.sys.updatedAt,
      }));
      const oldContentTypes = contentTypes.filter((contentType) =>
        isCtOld(contentType.updatedAt)
      );
      // @ts-expect-error
      setOldCts(oldContentTypes);

      setContentTypeData(contentTypeData);
      setEntryData(totalEntries);
      setLocaleData(totalLocales);
      setRoleData(totalRoles);
      setPublishedEntryData(totalPublishedEntries);
      setApiUsage(orgUsage);

      setLoading(false);
      setModal(false);
      setError(null);
    } catch (error: any) {
      setError(error);
      setLoading(false);
      setModal(true);
    }
  };

  useEffect(() => {
    if (error) {
      setModal(true);
    }
  }, [error, oldCts]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 600
        }}
      >
        <Spinner variant="primary" size="large" />
      </div>
    );

  return (
    <>
      <div style={{ padding: 10 }}>
        <Header title={"TAM Health Check ⚡️"} style={{ marginBottom: 10 }} />
        <Button onClick={() => setModal(true)}>Open modal</Button>
      </div>
      <Modal onClose={() => setModal(false)} isShown={modal}>
        {() => (
          <>
            <Modal.Header
              title="TAM Health Check"
              subtitle="Please enter the required information."
              onClose={() => setModal(false)}
            />
            <Modal.Content>
              {error && (
                <Note variant="negative" title="Error">
                  {error.message}
                </Note>
              )}
              <Form onSubmit={handleSubmit}>
                <FormControl>
                  <FormControl.Label isRequired>CMA Token</FormControl.Label>
                  <TextInput
                    value={formData.CMAKey}
                    placeholder="Your CMA Key"
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        CMAKey: e.target.value,
                      }));
                    }}
                  />
                  <FormControl.Label isRequired>Org ID</FormControl.Label>
                  <TextInput
                    value={formData.OrgID}
                    placeholder="Your Org ID"
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        OrgID: e.target.value,
                      }));
                    }}
                  />
                  <FormControl.Label isRequired>
                    Environment ID
                  </FormControl.Label>
                  <TextInput
                    maxLength={20}
                    value={formData.envID}
                    placeholder="Your Env ID"
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        envID: e.target.value,
                      }));
                    }}
                  />
                  <FormControl.Label isRequired>Space ID</FormControl.Label>
                  <TextInput
                    maxLength={20}
                    value={formData.spaceID}
                    placeholder="Your Space ID"
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        spaceID: e.target.value,
                      }));
                    }}
                  />
                </FormControl>
                <Button type="submit">Submit</Button>
              </Form>
            </Modal.Content>
            <Modal.Controls>
              <Button onClick={() => setModal(false)}>Close</Button>
            </Modal.Controls>
          </>
        )}
      </Modal>
      {!modal && (
        <>
          <div style={{ padding: 10, display: "flex", gap: 10 }}>
            <Card>
              <Heading>Content Types</Heading>
              <Text>Total: {ctData?.items?.length}</Text>
            </Card>
            <Card>
              <Heading>Entries</Heading>
              <Text>Total: {entryData?.total}</Text>
            </Card>
            <Card>
              <Heading>Published Entries</Heading>
              <Text>Total: {publishedEntryData?.total}</Text>
            </Card>
            <Card>
              <Heading>Locales</Heading>
              <Text>Total: {localeData?.total}</Text>
            </Card>
            <Card>
              <Heading>Roles</Heading>
              <Text>Total: {roleData?.total}</Text>
            </Card>
          </div>
          <div style={{ marginBottom: 40 }}>
            <UsageChart apiUsage={apiUsage} />
          </div>
          <div>
            <ContentTypeAudit oldCts={oldCts} formData={formData} />
          </div>
        </>
      )}
    </>
  );
};

export default Page;
