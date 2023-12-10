# sonosthesia-daw-connector

This packages is a node application which is meant to run in tadem with a DAW (Live, Logic Pro etc) in order to provide network connectivity to applications running on the local network. Specifically, it runs a websocket server which allows remote clients to send and subscribe to MIDI and OSC messages which are typically used to interact with DAWs.

## Getting Started

Install the `sonosthesia-daw-connector` package globally

```
npm install -g sonosthesia-daw-connector
```

Adapt a [configuration file](https://github.com/jbat100/sonosthesia-daw-connector#configuration). You can then run `sonosthesia-daw-connector` from the command line with the configuration file as argument (names in cwd, relative or absote paths are supported)

```
sonosthesia-daw-connector -config=./midi.json
```

By default errors accessing ports are reported but do not abort. You can add `strict` if this is your desired behaviour.

```
sonosthesia-daw-connector -config=./midi.json strict
```

## Configuration

Configuration is done via a JSON file.

### Simple MIDI relay configuration

```
{
    "server" : {
        "port" : 80,
        "logLevel" : 2
    },
    "midiSink" : {
        "ports" : [
            "IAC Driver Bus 1"
        ],
        "logLevel" : 2
    },
    "midiSource" : {
        "ports" : [
            "IAC Driver Bus 2"
        ],
        "logLevel" : 2
    }
}
```

Will run the websocket server on port 80, will allow remote clients to 

- send MIDI messages to ports `IAC Driver Bus 1`
- receive MIDI messages from ports `IAC Driver Bus 2`

Multiple ports can be specified and clients can specify sink or source ports they wish to send messages to or from.


## Websocket Server

The websocket server is the connection point for applications. It allows bi-lateral communication using a protocol based on [messagepack](https://msgpack.org/index.html) which is extremely efficient and portable. Each message has an OSC style address `string` and a `byte[]` payload which can be decoded according to the expected type.

## MIDI Sources and Sinks

A midi source listens to a MIDI input port on the local machine and relays the messages to websocket clients.

A midi sink listens to requests from websocket clients to send MIDI messages to a MIDI output port on the local machine.

Depending on the type of MIDI port, errors may be encountered because other processes (such as DAWs) have appropriated the ports to themselves. If you want to disable a MIDI port in Live you may do so in the MIDI settings. You can create loopback virtual MIDI ports by using apps like [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) on Windows and the [IAC driver](https://support.apple.com/en-sg/guide/audio-midi-setup/ams1013/mac) on macOS (see this Live [article](https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus)).

## OSC Sources and Sinks

An OSC source listens to a OSC port on the local machine and relays the messages to websocket clients. OSC sources are used to relay messages sent by the DAW (or DAW extensions/plugins). 

An OSC sink listens to requests from websocket clients to send OSC messages to an OSC port on the local machine. OSC sinks are used to relay messages to the DAW (or DAW extensions and plugins). 

When relaying OSC messages to and from websocket clients, specific messagepack data structures are used for each message type for efficiency.

## Websocket Client Implementations

A client implementation currently only exists for [Unity](https://github.com/jbat100/sonosthesia-unity-packages/tree/main/packages/com.sonosthesia.pack) but is relatively straightforward to implement on any platform which supports websockets and messagepack.

## M4L Devices

A number of [M4L devices](https://github.com/jbat100/sonosthesia-daw-connector/tree/main/m4l) are available to send Host, MIDI and Audio analysis information to OSC sources and to recieve requests from OSC sinks. This feature is still in early develoment.



