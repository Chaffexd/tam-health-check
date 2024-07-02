import { Accordion, Note, Text } from "@contentful/f36-components";

/* CMAKey: "",
OrgID: "",
envID: "",
spaceID: "", */

const ContentTypeAudit = ({ oldCts, formData }: any) => {
  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <Accordion>
        <Accordion.Item title="We think these content types might not be in use or haven't been updated a while">
          {oldCts.length === 0 ? (
            <Text>You're up to date, nothing to see here!</Text>
          ) : (
            oldCts.map((contentType: any) => (
              <a
                href={`https://app.contentful.com/spaces/${formData.spaceID}/environments/${formData.envID}/content_types/${contentType.id}/fields`}
                target="_blank"
              >
                <Note variant="warning" style={{ marginBottom: 10 }}>
                  {contentType.id}
                </Note>
              </a>
            ))
          )}
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ContentTypeAudit;
