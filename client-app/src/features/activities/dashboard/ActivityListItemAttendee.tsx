import { observer } from "mobx-react-lite";
import { Image, List, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
  attendees,
}: Props) {
  return (
    <List horizontal>
      {attendees.map((attendee) => {
        return (
          <Popup
            key={attendee.username}
            hoverable
            trigger={
              <List.Item
                key={attendee.username}
                as={Link}
                to={`/profile/${attendee.username}`}
              >
                <Image
                  size="mini"
                  circular
                  src={attendee.image || "/assets/user.png"}
                />
              </List.Item>
            }
          >
            <PopupContent>
              <ProfileCard profile={attendee}></ProfileCard>
            </PopupContent>
          </Popup>
        );
      })}
    </List>
  );
});
