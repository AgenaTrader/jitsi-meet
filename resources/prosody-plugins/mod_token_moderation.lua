---@author AgenaTrader, nvonahsen
-- Token moderation module copied from https://github.com/nvonahsen/jitsi-token-moderation-plugin.
-- It's used to modify the default Jicofo behavior of assigning a _moderator_ role to the first participant.
--
-- The module looks at incoming JWT token and decides the role of the user by setting a MUC affiliation.
-- You can read more about MUC roles and affiliations by reading the spec https://xmpp.org/extensions/xep-0045.html#associations
--
-- Note this module may break other affiliation based features like banning or login-based admins.
--

local log = module._log;
local jid_bare = require "util.jid".bare;
local json = require "cjson";
local basexx = require "basexx";

log('info', 'Loaded token moderation plugin');

-- Hook into room creation to add this wrapper to every new room
module:hook("muc-room-created", function(event)
    log('info', 'room created, adding token moderation code');
    local room = event.room;
    local _handle_normal_presence = room.handle_normal_presence;
    local _handle_first_presence = room.handle_first_presence;
    -- Wrap presence handlers to set affiliations from token whenever a user joins
    room.handle_normal_presence = function(thisRoom, origin, stanza)
        local pres = _handle_normal_presence(thisRoom, origin, stanza);
        setupAffiliation(thisRoom, origin, stanza);
        return pres;
    end;
    room.handle_first_presence = function(thisRoom, origin, stanza)
        local pres = _handle_first_presence(thisRoom, origin, stanza);
        setupAffiliation(thisRoom, origin, stanza);
        return pres;
    end;
    -- Wrap set affilaition to block anything but token setting owner (stop pesky auto-ownering)
    local _set_affiliation = room.set_affiliation;
    room.set_affiliation = function(room, actor, jid, affiliation, reason)
        -- let this plugin do whatever it wants
        if actor == "token_plugin" then
            return _set_affiliation(room, true, jid, affiliation, reason)
            -- noone else can assign owner (in order to block prosody/jisti's built in moderation functionality
        elseif affiliation == "owner" then
            return nil, "modify", "not-acceptable"
            -- keep other affil stuff working as normal (hopefully, haven't needed to use/test any of it)
        else
            return _set_affiliation(room, actor, jid, affiliation, reason);
        end ;
    end;
end);

-- Sets the affiliation based on JWT token.
function setupAffiliation(room, origin, stanza)

    if not origin.auth_token then
        return -- no JWT token could be found
    end

    -- Extract token body and decode it
    local dotFirst = origin.auth_token:find("%.");
    if dotFirst then
        local dotSecond = origin.auth_token:sub(dotFirst + 1):find("%.");
        if dotSecond then
            local bodyB64 = origin.auth_token:sub(dotFirst + 1, dotFirst + dotSecond - 1);
            local body = json.decode(basexx.from_url64(bodyB64));
            if (body["context"] and body["context"].user) then
                local context = body["context"];

                -- see Initial Role Based on Affiliation
                -- https://xmpp.org/extensions/xep-0045.html#table-4

                if context.user.role == "owner" or context.user.role == "executive" then
                    -- If the user should have moderation rights, then set their MUC affiliation to "owner",
                    -- this will automatically upgrade their MUC role to "moderator".
                    room:set_affiliation("token_plugin", jid_bare(stanza.attr.from), "owner");
                elseif context.user.role == "presenter" then
                    -- Participants get MUC affiliation "member". The MUC role will be "presenter".
                    room:set_affiliation("token_plugin", jid_bare(stanza.attr.from), "member");
                else
                    -- No MUC affiliation, the MUC role will be "presenter" anyway
                    -- Not sure where it's set, probably by Jicofo?
                    room:set_affiliation("token_plugin", jid_bare(stanza.attr.from), "none");
                end ;
            end ;
        end ;
    end ;

end;

