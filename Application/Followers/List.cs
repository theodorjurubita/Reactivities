using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings.Where(a => a.Target.UserName == request.Username)
                                        .Select(a => a.Observer)
                                        .ProjectTo<Profiles.Profile>(
                                            _mapper.ConfigurationProvider,
                                            new { currentUsername = _userAccessor.GetUserName() })
                                        .ToListAsync(cancellationToken);
                        break;

                    case "following":
                        profiles = await _context.UserFollowings.Where(a => a.Observer.UserName == request.Username)
                                        .Select(a => a.Target)
                                        .ProjectTo<Profiles.Profile>(
                                            _mapper.ConfigurationProvider,
                                            new { currentUsername = _userAccessor.GetUserName() })
                                        .ToListAsync(cancellationToken);
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}